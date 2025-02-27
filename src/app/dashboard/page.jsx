import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getModules } from '@/lib/db';
import ModuleList from '@/components/Dashboard/ModuleList';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const modules = await getModules();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Meine Module</h2>
        <ModuleList modules={modules} />
      </div>
    </div>
  );
}