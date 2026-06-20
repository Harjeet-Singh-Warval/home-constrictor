import type {Metadata} from 'next';
import { Montserrat, Geist } from 'next/font/google';
import './globals.css'; // Global styles

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans', // This matches display headings
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-mono', // Or body font
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pody — Specialized Modular & Tiny Homes',
  description: 'Factory-built homes designed for speed, sustainability, and customization. Architectural precision meets modern living.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geist.variable}`}>
      <body className="bg-[#faf9f7] text-[#1a1c1b] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

