
import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/hostvoucher/ClientLayout';

export const metadata: Metadata = {
  title: 'HostVoucher - Exclusive Hosting, VPN, and Domain Deals',
  description: 'Your #1 source for exclusive tech & digital service deals!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased transition-colors duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
