import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Background from '@/components/Background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solium AI | Modern AI Agency',
  description: 'Transform your business with AI-powered solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Background />
        {children}
      </body>
    </html>
  );
}
