'use client';

import Link from 'next/link';
import { Key, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
          Your AI Context,
          <span className="text-primary-600"> Your Control</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Create a secure, portable AI context that follows you everywhere. 
          No more re-explaining yourself to every AI assistant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Create Your First Key
          </Link>
          <Link
            href="/demo"
            className="btn btn-outline px-8 py-3 text-lg"
          >
            See How It Works
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure by Default</h3>
          <p className="text-gray-600">
            End-to-end encryption ensures your data stays private and secure.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Portable Context</h3>
          <p className="text-gray-600">
            Take your AI context anywhere. Works with any compatible chat app.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Instant Setup</h3>
          <p className="text-gray-600">
            Get started in minutes. No complex configuration required.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">You Own Your Data</h3>
          <p className="text-gray-600">
            Your context key belongs to you. No vendor lock-in, ever.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Your Key</h3>
            <p className="text-gray-600">
              Set up your profile, preferences, and connect your knowledge sources.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Load Into Chat</h3>
            <p className="text-gray-600">
              Upload your key to any compatible AI chat application.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Chat Naturally</h3>
            <p className="text-gray-600">
              The AI instantly knows your context and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Create your first Context Key in under 5 minutes.
        </p>
        <Link
          href="/create"
          className="btn btn-primary px-8 py-3 text-lg"
        >
          Create Context Key
        </Link>
      </div>
    </div>
  );
}
