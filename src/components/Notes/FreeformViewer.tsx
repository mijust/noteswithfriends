// File location: /src/components/Notes/FreeformViewer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Download, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FreeformViewerProps {
  fileUrl: string;
  fileName: string;
  className?: string;
}

const FreeformViewer: React.FC<FreeformViewerProps> = ({ 
  fileUrl, 
  fileName, 
  className 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setZoomLevel(1); // Reset zoom level when toggling fullscreen
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom: 300%
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom: 50%
  };
  
  // Reset zoom with double click
  const handleDoubleClick = () => {
    setZoomLevel(1);
  };
  
  // Escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling when in fullscreen
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-secondary-900/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut}
            leftIcon={<ZoomOut className="h-4 w-4" />}
            aria-label="Zoom out"
          >
            Zoom Out
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn}
            leftIcon={<ZoomIn className="h-4 w-4" />}
            aria-label="Zoom in"
          >
            Zoom In
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            leftIcon={<Minimize className="h-4 w-4" />}
            aria-label="Exit fullscreen"
          >
            Schließen
          </Button>
        </div>
        <div
          className="relative max-w-6xl max-h-[90vh] w-full h-full overflow-auto p-4"
          onDoubleClick={handleDoubleClick}
          style={{ cursor: 'zoom-in' }}
        >
          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}>
            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
              <Image 
                src={fileUrl} 
                alt={fileName} 
                fill
                objectFit="contain" 
                quality={100}
                className="rounded-md" 
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-secondary-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
          {Math.round(zoomLevel * 100)}% • Doppelklick zum Zurücksetzen
        </div>
      </div>
    );
  }
  
  return (
    <Card 
      ref={viewerRef}
      className={cn("transition-shadow hover:shadow-md", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base truncate">{fileName}</CardTitle>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.open(fileUrl, '_blank')}
            aria-label="Öffnen"
            title="In neuem Tab öffnen"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = fileName;
              link.click();
            }}
            aria-label="Herunterladen"
            title="Herunterladen"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            aria-label="Vollbild"
            title="Vollbild"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 border-t border-secondary-200 dark:border-secondary-700">
        <div 
          className="relative aspect-video cursor-pointer hover:opacity-90 transition-opacity"
          onClick={toggleFullscreen}
        >
          <Image 
            src={fileUrl} 
            alt={fileName}
            fill
            objectFit="cover"
            className="rounded-b-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-secondary-900/70 text-white p-3 rounded-full">
              <Maximize className="h-6 w-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeformViewer;