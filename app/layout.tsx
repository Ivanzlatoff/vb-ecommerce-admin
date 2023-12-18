import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/providers/ToastProvider';
import ModalProvider from '@/providers/ModalProvider';
import AuthProvider from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <AuthProvider>
            <main className='h-screen'>
              {children}
            </main>
            <ModalProvider />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
