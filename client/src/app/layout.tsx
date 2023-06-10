'use client'
import { Navbar } from '@/components/Navbar'
import './globals.css'
import Head from './head'
import { AuthProvider } from '@/context/auth'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head/>
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
