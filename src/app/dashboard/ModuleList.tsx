// File location: /src/components/Dashboard/ModuleList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, File, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils';
import { Module } from '@/lib/db';

interface ModuleListProps {
  modules: Module[];
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  if (!modules || modules.length === 0) {
    return (
      <Card className="bg-secondary-50 dark:bg-secondary-800/50 border-dashed">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Noch keine Module vorhanden
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Erstelle dein erstes Modul, um Notizen zu organisieren und mit anderen zu teilen.
          </p>
          <Link 
            href="/module/new"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors 
                      bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Neues Modul erstellen
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <Link 
          key={module._id.toString()}
          href={`/module/${module._id}`}
          className="group"
        >
          <Card className="h-full transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] hover:border-primary-300 dark:hover:border-primary-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-secondary-50 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 line-clamp-2">
                    {module.description}
                  </p>
                </div>
                <span className="flex items-center justify-center w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-700 dark:text-primary-400">
                  <BookOpen className="h-5 w-5" />
                </span>
              </div>
              
              <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700 flex items-center justify-between text-sm">
                <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                  <File className="h-4 w-4 mr-1" />
                  <span>{module.notes?.length || 0} Notizen</span>
                </div>
                
                <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span title={new Date(module.updatedAt).toLocaleString('de-DE')}>
                    {formatRelativeTime(module.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      <Link 
        href="/module/new"
        className="group"
      >
        <Card className="h-full bg-secondary-50 dark:bg-secondary-800/50 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800/80 transition-colors">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <Plus className="h-8 w-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
              Neues Modul erstellen
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
              Erstelle ein neues Modul für deine Notizen
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ModuleList;