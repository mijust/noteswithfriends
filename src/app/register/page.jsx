// File location: /src/app/register/page.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-secondary-50 dark:bg-secondary-900">
      <RegisterForm />
    </main>
  );
}