import { Inter } from 'next/font/google';
import '../styles/globals.css';
import SessionProvider from '@/components/Auth/SessionProvider';
import NavBar from '@/components/layout/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Notizen Platform',
  description: 'Teile deine Lernnotizen mit Freunden',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <SessionProvider>
          <NavBar />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}