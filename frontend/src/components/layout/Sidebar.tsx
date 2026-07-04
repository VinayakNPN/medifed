import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Database, 
  Home, 
  Lock, 
  Network, 
  ShieldCheck, 
  Stethoscope 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/coordinator', icon: Home },
  { name: 'Hospital View', path: '/hospital', icon: Stethoscope },
  { name: 'Training', path: '/training', icon: Activity },
  { name: 'Prediction', path: '/prediction', icon: Database },
  { name: 'Privacy', path: '/privacy', icon: ShieldCheck },
  { name: 'Blockchain', path: '/blockchain', icon: Network },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Lock className="w-6 h-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-tight">MediFed</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="text-sm font-semibold mb-1">Fhenix Network</h4>
          <p className="text-xs text-muted-foreground">Connected & Encrypted</p>
        </div>
      </div>
    </aside>
  );
}
