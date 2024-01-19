import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider, signOut } from 'next-auth/react';
import './globals.css';
import { Toaster } from '@/providers/ToastProvider';
import { Toaster as SonnexToaster } from 'sonner';
import ModalProvider from '@/providers/ModalProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { auth } from '@/auth';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <SessionProvider session={session}>
            <main className='w-screen max-h-fit min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 dark:from-slate-500 to-slate-300 dark:to-slate-900'>
              {children}
            </main>
            <ModalProvider />
            <Toaster />
            <SonnexToaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
