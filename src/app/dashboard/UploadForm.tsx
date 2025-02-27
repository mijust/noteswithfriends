// File location: /src/components/Dashboard/UploadForm.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, File, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils';

interface UploadFormProps {
  moduleId: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ moduleId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check file type
    const validTypes = ['.md', '.freeform'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!validTypes.some(type => file.name.endsWith(type))) {
      setError(`Ungültiger Dateityp. Erlaubte Formate: ${validTypes.join(', ')}`);
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Die Datei ist zu groß. Maximale Dateigröße: 10MB');
      return;
    }
    
    setFile(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('moduleId', moduleId);
      
      // Simulate upload progress (in a real app, you'd use a proper upload mechanism)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload fehlgeschlagen');
      }
      
      setUploadProgress(100);
      
      // Small delay to show 100% before closing
      setTimeout(() => {
        // Update the page to show the new file
        router.refresh();
        setShowForm(false);
        setFile(null);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler beim Hochladen');
    } finally {
      setIsUploading(false);
    }
  };

  // File icon based on file type
  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.name.endsWith('.md')) {
      return <FileText className="h-10 w-10 text-primary-500" />;
    }
    
    return <File className="h-10 w-10 text-primary-500" />;
  };

  return (
    <>
      <Button
        onClick={() => setShowForm(!showForm)}
        variant={showForm ? "secondary" : "default"}
        leftIcon={showForm ? <X size={16} /> : <Upload size={16} />}
      >
        {showForm ? 'Abbrechen' : 'Notiz hochladen'}
      </Button>
      
      {showForm && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => !isUploading && setShowForm(false)}
        >
          <div 
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
                Neue Notiz hochladen
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {!file ? (
                <div 
                  className={`border-2 ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dashed border-secondary-300 dark:border-secondary-700'} rounded-lg p-8 text-center`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".md,.freeform"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  <Upload className="h-12 w-12 mx-auto text-secondary-500 dark:text-secondary-400 mb-4" />
                  
                  <div className="text-secondary-900 dark:text-secondary-100 font-medium mb-2">
                    Datei hier ablegen oder
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 dark:text-primary-400 hover:underline ml-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      durchsuchen
                    </button>
                  </div>
                  
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                    Unterstützte Formate: Markdown (.md), Apple Freeform (.freeform)
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Maximale Dateigröße: 10MB
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 flex items-start gap-4">
                    {getFileIcon()}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-secondary-900 dark:text-secondary-100 mb-1 truncate">
                        {file.name}
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {formatFileSize(file.size)}
                      </div>
                      
                      {isUploading && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                            {Math.round(uploadProgress)}% hochgeladen
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                      disabled={isUploading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-4 text-sm text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                  disabled={isUploading}
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  isLoading={isUploading}
                >
                  {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;