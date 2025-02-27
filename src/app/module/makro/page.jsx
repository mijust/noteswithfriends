// File location: /src/app/module/[id]/page.jsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getModuleById } from '@/lib/db';
import MarkdownViewer from '@/components/Notes/MarkdownViewer';
import FreeformViewer from '@/components/Notes/FreeformViewer';
import UploadForm from '@/components/Dashboard/UploadForm';

export default async function ModulePage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const moduleId = params.id;
  const module = await getModuleById(moduleId);
  
  if (!module) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Modul nicht gefunden</h1>
        <p>Das angeforderte Modul existiert nicht oder wurde gelöscht.</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{module.title}</h1>
        <UploadForm moduleId={module._id} />
      </div>
      
      <p className="text-gray-600 mb-8">{module.description}</p>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Markdown-Notizen</h2>
          {module.notes.filter(note => note.type === 'markdown').length === 0 ? (
            <p className="text-gray-500">Keine Markdown-Notizen vorhanden</p>
          ) : (
            <div className="space-y-4">
              {module.notes
                .filter(note => note.type === 'markdown')
                .map(note => (
                  <MarkdownViewer 
                    key={note._id} 
                    content={note.content} 
                    fileName={note.fileName} 
                  />
                ))
              }
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Freeform-Notizen</h2>
          {module.notes.filter(note => note.type === 'freeform').length === 0 ? (
            <p className="text-gray-500">Keine Freeform-Notizen vorhanden</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.notes
                .filter(note => note.type === 'freeform')
                .map(note => (
                  <FreeformViewer 
                    key={note._id} 
                    fileUrl={note.fileUrl} 
                    fileName={note.fileName} 
                  />
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}