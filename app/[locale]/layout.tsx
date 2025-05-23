import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import { Toaster } from '@/providers/ToastProvider';
import { Toaster as SonnexToaster } from 'sonner';
import ModalProvider from '@/providers/ModalProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { auth } from '@/auth';
import TranslationsProvider from '@/providers/TranslationsProvider';
import initTranslations from '../i18n';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

const i18nNamespaces = [
  'common', 
  'user-info', 
  'login', 
  'register', 
  'main-nav', 
  'api-alert',
  'data-table',
  'user-settings',
  'admin',
  'zod',
  'dashboard',
  'orders',
  'settings'
];

export default async function RootLayout(
  {
    children, 
    params 
  }: 
  { 
    children: React.ReactNode; 
    params: Promise<{ locale: string }> 
  }) {
  const { locale } = await params;
  const session = await auth();
  const { resources } = await initTranslations({
    locale, 
    namespaces: i18nNamespaces
  });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
            <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
              <main className='w-screen max-h-fit min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 dark:from-slate-500 to-slate-300 dark:to-slate-900'>
                {children}
              </main>
              <ModalProvider />
              <Toaster />
              <SonnexToaster />
            </ThemeProvider>
          </TranslationsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
