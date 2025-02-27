// File location: /src/app/dashboard/page.jsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getModules } from '@/lib/db';
import ModuleList from '@/components/Dashboard/ModuleList';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const modules = await getModules(session.user.id);
  
  return (
    <div className="container-wide p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/module/new">
          <Button leftIcon={<Plus size={16} />}>
            Neues Modul erstellen
          </Button>
        </Link>
      </div>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Meine Module</h2>
        <ModuleList modules={modules} />
      </section>
    </div>
  );
}