'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/Auth/LoginForm';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <LoginForm />
    </main>
  );
}