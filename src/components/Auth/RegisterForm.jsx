// File location: /src/components/Auth/RegisterForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validateForm = () => {
    // Reset previous errors
    setError('');
    
    // Username validation
    if (username.length < 3) {
      setError('Der Benutzername muss mindestens 3 Zeichen lang sein');
      return false;
    }
    
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    
    // Password matching
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }
      
      setSuccessMessage('Registrierung erfolgreich! Du wirst zur Anmeldeseite weitergeleitet...');
      
      // Navigate to login page after showing success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-secondary-800 p-8 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-secondary-900 dark:text-secondary-50">
        Registrieren
      </h2>
      
      {successMessage ? (
        <div className="bg-success-50 dark:bg-success-900/30 text-success-600 dark:text-success-400 p-4 rounded-md mb-4 text-center">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-50 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 font-medium text-secondary-700 dark:text-secondary-300">
              Benutzername
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium text-secondary-700 dark:text-secondary-300">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium text-secondary-700 dark:text-secondary-300">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              Mindestens 6 Zeichen
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-1 font-medium text-secondary-700 dark:text-secondary-300">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            className="w-full"
          >
            {loading ? 'Registrierung läuft...' : 'Registrieren'}
          </Button>
          
          <div className="mt-4 text-center text-secondary-600 dark:text-secondary-400">
            Du hast bereits ein Konto?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Anmelden
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}