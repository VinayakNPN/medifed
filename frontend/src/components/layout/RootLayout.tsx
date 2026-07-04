import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopNav />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
