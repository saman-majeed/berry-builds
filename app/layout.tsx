import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'BerryBuilds – Software Development & AI Solutions',
  description: 'From cutting-edge web applications to intelligent AI systems, we help businesses transform their ideas into powerful digital solutions.',
  keywords: 'web development, AI, mobile apps, software development, Pakistan',
  openGraph: {
    title: 'BerryBuilds – Software Development & AI Solutions',
    description: 'We Build Digital Products That Scale',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
