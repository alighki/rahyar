import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="mr-64 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
