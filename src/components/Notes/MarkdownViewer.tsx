// File location: /src/components/Notes/MarkdownViewer.tsx
'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MarkdownViewerProps {
  content: string;
  fileName: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  fileName, 
  className 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Function to download markdown content as a file
  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling of body when fullscreen
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
      <div className="fixed inset-0 z-50 bg-white dark:bg-secondary-900 flex flex-col overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
          <h3 className="font-medium text-lg text-secondary-900 dark:text-secondary-50">
            {fileName}
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              leftIcon={isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            >
              {isCopied ? 'Kopiert!' : 'Kopieren'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadMarkdown}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Herunterladen
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen}
              leftIcon={<Minimize className="h-4 w-4" />}
            >
              Schließen
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="container-narrow mx-auto">
            <ReactMarkdown 
              className="prose prose-blue dark:prose-invert max-w-none" 
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base truncate">{fileName}</CardTitle>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            aria-label="Inhalt kopieren"
            title="Inhalt kopieren"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={downloadMarkdown}
            aria-label="Markdown herunterladen"
            title="Herunterladen"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            aria-label="Vollbild anzeigen"
            title="Vollbild"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-auto border-t border-secondary-200 dark:border-secondary-700 p-4">
        <ReactMarkdown 
          className="prose prose-blue dark:prose-invert max-w-none" 
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default MarkdownViewer;