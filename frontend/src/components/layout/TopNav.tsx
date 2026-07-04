import { Bell, Search, User } from 'lucide-react';
import { useStore } from '@/store';

export function TopNav() {
  const role = useStore((state) => state.role);

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-muted border-none rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
            Current Role: <span className="ml-1 text-foreground capitalize">{role || 'Guest'}</span>
          </div>
          <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
