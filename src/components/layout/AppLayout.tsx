import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UtensilsCrossed, Receipt, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
interface AppLayoutProps {
  children: ReactNode;
}
const navItems = [{
  path: '/',
  icon: Home,
  label: 'Home'
}, {
  path: '/students',
  icon: Users,
  label: 'Students'
}, {
  path: '/punch',
  icon: UtensilsCrossed,
  label: 'Punch Meal'
}, {
  path: '/billing',
  icon: Receipt,
  label: 'Billing'
}, {
  path: '/settings',
  icon: Settings,
  label: 'Settings'
}];
export function AppLayout({
  children
}: AppLayoutProps) {
  const location = useLocation();
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">BhojanBook
          </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => <Link key={item.path} to={item.path} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors', location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>)}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => <Link key={item.path} to={item.path} className={cn('flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors', location.pathname === item.path ? 'text-primary' : 'text-muted-foreground')}>
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>)}
        </div>
      </nav>
    </div>;
}