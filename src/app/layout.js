import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './authProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Audio Player App',
  description: 'A modern Next.js audio player application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}