// File location: /src/app/module/new/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NewModulePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="p-6 text-center">Laden...</div>;
  }
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!title.trim()) {
      setError('Bitte gib einen Titel ein');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          ownerId: session.user.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Erstellen des Moduls');
      }
      
      const data = await response.json();
      router.push(`/module/${data.moduleId}`);
    } catch (error) {
      console.error('Error creating module:', error);
      setError(error.message || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-narrow py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Neues Modul erstellen</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Moduldetails</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-danger-50 text-danger-600 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="form-label">
                Titel *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="form-label">
                Beschreibung
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input min-h-[100px]"
                placeholder="Eine kurze Beschreibung des Moduls (optional)"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              Modul erstellen
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}