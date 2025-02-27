'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm({ moduleId }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('moduleId', moduleId);
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload fehlgeschlagen');
      }
      
      // Aktualisiere die Seite, um die neue Datei anzuzeigen
      router.refresh();
      setShowForm(false);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {showForm ? 'Abbrechen' : 'Notiz hochladen'}
      </button>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Neue Notiz hochladen</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Datei auswählen (.md oder Freeform)
                </label>
                <input
                  type="file"
                  accept=".md,.freeform"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Unterstützte Formate: Markdown (.md), Apple Freeform (.freeform)
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
