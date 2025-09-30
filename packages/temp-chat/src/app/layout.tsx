import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Context Key Temp Chat',
  description: 'Ephemeral AI chat with context loading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Context Key Temp Chat
                  </h1>
                  <span className="ml-3 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Ephemeral
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  No data is stored permanently
                </div>
              </div>
            </div>
          </header>
          <main className="h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </body>
    </html>
  );
}
