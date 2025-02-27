'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function FreeformViewer({ fileUrl, fileName }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef(null);
  
  // In einer tatsächlichen Implementierung würden wir hier die Freeform-Datei 
  // in eine interaktive Ansicht umwandeln. Für dieses Beispiel zeigen wir ein Bild an,
  // das aus der Freeform-Datei generiert wurde
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Schließen des Vollbildmodus mit ESC-Taste
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  return (
    <div 
      ref={viewerRef}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <h3 className="font-medium truncate">{fileName}</h3>
        <div className="flex space-x-2">
          <a 
            href={fileUrl} 
            download={fileName}
            className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
          >
            Herunterladen
          </a>
          <button 
            onClick={toggleFullscreen}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          >
            {isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
          </button>
        </div>
      </div>
      
      <div className={`relative ${isFullscreen ? 'flex-1 overflow-auto' : 'h-96'}`}>
        {/* Hier würde eine interaktive Vorschau der Freeform-Datei angezeigt werden */}
        {/* Für dieses Beispiel zeigen wir ein konvertiertes Bild */}
        <div className="relative w-full h-full">
          <Image 
            src={fileUrl} 
            alt={fileName} 
            layout="fill" 
            objectFit="contain" 
            className="p-4"
          />
        </div>
      </div>
      
      {isFullscreen && (
        <div className="p-3 bg-gray-50 border-t">
          <button 
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Vollbild beenden
          </button>
        </div>
      )}
    </div>
  );
}