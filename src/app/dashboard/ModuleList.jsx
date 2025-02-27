import Link from 'next/link';

export default function ModuleList({ modules }) {
  if (!modules || modules.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p>Noch keine Module vorhanden. Erstelle dein erstes Modul!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <Link 
          key={module._id}
          href={`/module/${module._id}`}
          className="block"
        >
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{module.notes.length} Notizen</span>
              <span className="mx-2">•</span>
              <span>Zuletzt aktualisiert: {new Date(module.updatedAt).toLocaleDateString('de-DE')}</span>
            </div>
          </div>
        </Link>
      ))}

      <Link 
        href="/module/new"
        className="block"
      >
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center h-full hover:bg-gray-100 transition">
          <div className="text-center">
            <span className="block text-3xl text-gray-400 mb-2">+</span>
            <span className="text-gray-600 font-medium">Neues Modul erstellen</span>
          </div>
        </div>
      </Link>
    </div>
  );
}