'use client';

import { useState } from 'react';
import { Bell, Search, Sun, Moon, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function Topbar({ title }: { title?: string }) {
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks, skills, people..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* AI indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span className="text-xs text-indigo-400 font-medium">AI Active</span>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </div>

        {/* Dark mode */}
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full" onClick={toggleDark}>
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 rounded-full relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </Button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <Badge variant="secondary" className="text-xs">{unread} new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={cn(
                    'px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 last:border-0 transition-colors',
                    !n.read && 'bg-indigo-500/5'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                        !n.read ? 'bg-indigo-500' : 'bg-transparent'
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</div>
                        <div className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <button className="w-full text-xs text-primary hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
