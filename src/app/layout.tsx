import { Inter } from 'next/font/google';
import '../styles/globals.css'; // Updated import path
import { SessionProvider } from 'next-auth/react'; // Geändert zu SessionProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Notizen Platform',
  description: 'Teile deine Lernnotizen mit Freunden',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {/* In Next.js 13/14 mit App Router müssen wir einen Client-Wrapper für SessionProvider erstellen */}
        {children}
      </body>
    </html>
  );
}