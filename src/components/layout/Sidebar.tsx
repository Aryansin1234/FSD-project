'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CheckSquare, Zap, BarChart3, FolderKanban,
  Clock, User, Settings, Users, Shield, ChevronRight, Cpu, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, badge: '5' },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/skills', label: 'My Skills', icon: Zap },
  { href: '/effort', label: 'Effort Log', icon: Clock },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/career', label: 'Career Path', icon: TrendingUp },
];

const adminItems = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{ background: 'var(--sidebar)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-sidebar" />
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-tight">SkillForge</span>
          <div className="text-[10px] text-sidebar-foreground/50 -mt-0.5">AI Workforce Intel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                active
                  ? 'bg-sidebar-accent text-white font-medium'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}>
              <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : 'text-sidebar-foreground/50 group-hover:text-indigo-400')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="h-5 px-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 border-0 font-medium">
                  {item.badge}
                </Badge>
              )}
              {active && <ChevronRight className="w-3 h-3 text-indigo-400" />}
            </Link>
          );
        })}

        {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
          <>
            <div className="pt-4 pb-2 px-3">
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/30 font-semibold">Administration</span>
            </div>
            {adminItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                    active
                      ? 'bg-sidebar-accent text-white font-medium'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}>
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : 'text-sidebar-foreground/50 group-hover:text-indigo-400')} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User profile at bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <Link href="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {currentUser.firstName[0]}{currentUser.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-[11px] text-sidebar-foreground/50 capitalize">{currentUser.role}</div>
          </div>
          <Settings className="w-3.5 h-3.5 text-sidebar-foreground/30 flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
