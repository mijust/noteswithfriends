import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Failed to get server session:', error);
    session = null;
  }

  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Willkommen zur Notizen-Plattform</h1>
        <p className="text-xl mb-8">
          Teile deine Lernnotizen mit Freunden und organisiere dein Wissen.
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Anmelden
          </Link>
        </div>
      </div>
    </main>
  );
}