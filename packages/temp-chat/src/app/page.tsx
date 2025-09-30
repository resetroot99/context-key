'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Send, Upload, Key, AlertCircle, CheckCircle, X } from 'lucide-react';
import { 
  decryptContextKey, 
  verifyContextKey,
  type SignedContextKey,
  type ContextKey 
} from '@context-key/crypto';
import { ChatMessage } from '@context-key/shared';

interface LoadedContext {
  contextKey: ContextKey;
  displayName: string;
  tone: string;
  domains: string[];
}

export default function TempChatPage() {
  const [loadedContext, setLoadedContext] = useState<LoadedContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyLoader, setShowKeyLoader] = useState(true);
  const [password, setPassword] = useState('');
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.ckey'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setKeyFile(acceptedFiles[0]);
        setError(null);
      }
    },
  });

  const loadContextKey = async () => {
    if (!keyFile || !password) {
      setError('Please select a key file and enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read the file
      const fileContent = await keyFile.text();
      const encryptedKey = JSON.parse(fileContent);

      // Decrypt the key
      const signedKey: SignedContextKey = await decryptContextKey(encryptedKey, password);

      // Verify the signature
      if (!verifyContextKey(signedKey)) {
        throw new Error('Invalid key signature');
      }

      const contextKey = signedKey.data;

      // Set up the loaded context
      setLoadedContext({
        contextKey,
        displayName: contextKey.profile.display_name,
        tone: contextKey.profile.tone,
        domains: contextKey.profile.domains,
      });

      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: `Context Key loaded for ${contextKey.profile.display_name}. This session is ${contextKey.policies.persistence}.`,
        timestamp: new Date().toISOString(),
      };

      setMessages([systemMessage]);
      setShowKeyLoader(false);
      setPassword('');
      setKeyFile(null);

      // Focus on input
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error('Error loading context key:', error);
      setError('Failed to load context key. Please check your file and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !loadedContext) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Construct system prompt with context
      const systemPrompt = `You are a helpful AI assistant. Here is your context:

Display Name: ${loadedContext.displayName}
Communication Style: ${loadedContext.tone}
Areas of Expertise: ${loadedContext.domains.join(', ')}

Please respond according to this context and communication style. Be helpful and knowledgeable about the user's areas of expertise.`;

      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: userMessage.content },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearSession = () => {
    setLoadedContext(null);
    setMessages([]);
    setShowKeyLoader(true);
    setError(null);
  };

  if (showKeyLoader) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <Key className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Load Your Context Key
              </h2>
              <p className="text-gray-600">
                Upload your .ckey file to start a personalized chat session
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : keyFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                {keyFile ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">{keyFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop your .ckey file here'
                        : 'Drag & drop your .ckey file here, or click to select'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your key password"
                  onKeyPress={(e) => e.key === 'Enter' && loadContextKey()}
                />
              </div>

              <button
                onClick={loadContextKey}
                disabled={!keyFile || !password || isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Loading...' : 'Load Context Key'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have a Context Key?{' '}
                <a
                  href="http://localhost:3000/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Context Info Bar */}
      {loadedContext && (
        <div className="bg-primary-50 border-b border-primary-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium text-primary-900">
                {loadedContext.displayName}
              </span>
              <span className="text-primary-600 text-sm ml-2">
                • {loadedContext.domains.slice(0, 2).join(', ')}
                {loadedContext.domains.length > 2 && ` +${loadedContext.domains.length - 2} more`}
              </span>
            </div>
            <button
              onClick={clearSession}
              className="text-primary-600 hover:text-primary-700 p-1"
              title="Clear session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 
              message.role === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            <div
              className={
                message.role === 'user'
                  ? 'message-user'
                  : message.role === 'system'
                  ? 'message-system'
                  : 'message-assistant'
              }
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="message-assistant">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="textarea flex-1"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn btn-primary px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
