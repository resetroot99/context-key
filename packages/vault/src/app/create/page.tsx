'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Download, Key } from 'lucide-react';
import Link from 'next/link';
import { 
  generateKeyPair, 
  signContextKey, 
  encryptContextKey,
  type ContextKey 
} from '@context-key/crypto';
import { 
  DEFAULT_TONES, 
  DEFAULT_DOMAINS, 
  CONTEXT_KEY_VERSION,
  generateId 
} from '@context-key/shared';

interface FormData {
  display_name: string;
  tone: string;
  custom_tone: string;
  domains: string[];
  custom_domains: string;
  allow_writeback: boolean;
  persistence: 'ephemeral' | 'session' | 'permanent';
  pii_handling: 'strict' | 'moderate' | 'permissive';
  password: string;
  confirm_password: string;
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tone: DEFAULT_TONES[1],
      domains: [DEFAULT_DOMAINS[0]],
      allow_writeback: true,
      persistence: 'session',
      pii_handling: 'moderate',
    }
  });

  const watchedTone = watch('tone');
  const watchedDomains = watch('domains');
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (data.password !== data.confirm_password) {
      alert('Passwords do not match');
      return;
    }

    setIsGenerating(true);

    try {
      // Parse domains
      const allDomains = [...data.domains];
      if (data.custom_domains) {
        allDomains.push(...data.custom_domains.split(',').map(d => d.trim()));
      }

      // Create the context key
      const contextKey: ContextKey = {
        version: CONTEXT_KEY_VERSION,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: {
          display_name: data.display_name,
          tone: data.tone === 'custom' ? data.custom_tone : data.tone,
          domains: allDomains,
        },
        policies: {
          allow_writeback: data.allow_writeback,
          persistence: data.persistence,
          pii_handling: data.pii_handling,
        },
        data_sources: [],
        memories: [],
      };

      // Generate key pair and sign
      const keyPair = generateKeyPair();
      const signedKey = signContextKey(contextKey, keyPair.privateKey);

      // Encrypt the signed key
      const encryptedKey = await encryptContextKey(signedKey, data.password);

      // Create downloadable file
      const blob = new Blob([JSON.stringify(encryptedKey, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const filename = `${data.display_name.replace(/\s+/g, '_').toLowerCase()}_context_key.ckey`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setGeneratedKey(filename);
      setStep(4);
    } catch (error) {
      console.error('Error generating key:', error);
      alert('Failed to generate key. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex items-center mb-4">
            <Key className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h1 className="card-title">Create Your Context Key</h1>
              <p className="card-description">
                Step {step} of 4: {
                  step === 1 ? 'Profile Setup' :
                  step === 2 ? 'Privacy Settings' :
                  step === 3 ? 'Security' : 'Complete'
                }
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-content">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    {...register('display_name', { required: 'Display name is required' })}
                    className="input"
                    placeholder="How should the AI address you?"
                  />
                  {errors.display_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication Style
                  </label>
                  <select {...register('tone')} className="input">
                    {DEFAULT_TONES.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                    <option value="custom">Custom...</option>
                  </select>
                  
                  {watchedTone === 'custom' && (
                    <textarea
                      {...register('custom_tone')}
                      className="textarea mt-2"
                      placeholder="Describe your preferred communication style..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {DEFAULT_DOMAINS.map(domain => (
                      <label key={domain} className="flex items-center">
                        <input
                          type="checkbox"
                          value={domain}
                          {...register('domains')}
                          className="mr-2"
                        />
                        <span className="text-sm">{domain}</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    {...register('custom_domains')}
                    className="textarea"
                    placeholder="Add custom domains (comma-separated)..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Memory Settings
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('allow_writeback')}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">Allow AI to save new memories</span>
                        <p className="text-sm text-gray-500">
                          The AI can remember important facts from your conversations
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Persistence
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="ephemeral"
                        {...register('persistence')}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">Ephemeral</span>
                        <p className="text-sm text-gray-500">Forget everything after each session</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="session"
                        {...register('persistence')}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">Session</span>
                        <p className="text-sm text-gray-500">Remember within the same session</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="permanent"
                        {...register('persistence')}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">Permanent</span>
                        <p className="text-sm text-gray-500">Save memories permanently</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Level
                  </label>
                  <select {...register('pii_handling')} className="input">
                    <option value="strict">Strict - Remove all personal information</option>
                    <option value="moderate">Moderate - Mask sensitive data</option>
                    <option value="permissive">Permissive - Keep all information</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Important Security Notice</h3>
                  <p className="text-sm text-yellow-700">
                    Your password encrypts your Context Key. If you lose it, your key cannot be recovered.
                    Choose a strong password and store it safely.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encryption Password
                  </label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                    className="input"
                    placeholder="Enter a strong password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register('confirm_password', { required: 'Please confirm your password' })}
                    className="input"
                    placeholder="Confirm your password"
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
                  )}
                  {password && watch('confirm_password') && password !== watch('confirm_password') && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <Download className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Context Key Created Successfully!
                  </h3>
                  <p className="text-green-700">
                    Your encrypted context key has been downloaded as: <br />
                    <code className="bg-green-100 px-2 py-1 rounded">{generatedKey}</code>
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Next Steps:</h4>
                  <ol className="text-left space-y-2 text-sm text-gray-600">
                    <li>1. Keep your password safe - you'll need it to use your key</li>
                    <li>2. Store your .ckey file in a secure location</li>
                    <li>3. Try loading your key in our Temp Chat application</li>
                    <li>4. Install our browser extension for seamless integration</li>
                  </ol>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/temp-chat" className="btn btn-primary">
                    Try Temp Chat
                  </Link>
                  <Link href="/manage" className="btn btn-outline">
                    Manage Keys
                  </Link>
                </div>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="card-footer justify-between">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                className="btn btn-outline"
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  'Generating...'
                ) : step === 3 ? (
                  'Create Key'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
