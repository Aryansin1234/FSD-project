'use client';

import { useState } from 'react';
import {
  CheckSquare, Clock, Zap, TrendingUp, Brain, AlertTriangle,
  CheckCircle2, Circle, ArrowUpRight, Cpu, ChevronRight, Plus
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser, tasks, effortLogs, velocityData } from '@/lib/mock-data';
import { PROFICIENCY_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const priorityColor: Record<string, string> = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-amber-500',
  low: 'text-blue-500',
};

const statusIcon = (status: string) => {
  if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'in_progress') return <div className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /></div>;
  if (status === 'review') return <div className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /></div>;
  return <Circle className="w-4 h-4 text-muted-foreground" />;
};

export default function OverviewPage() {
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== 'completed').slice(0, 5);
  const thisWeekLogs = effortLogs.filter(l => l.userId === currentUser.id);
  const totalHours = thisWeekLogs.reduce((sum, l) => sum + l.hours, 0);

  const radarData = currentUser.skills.slice(0, 6).map(s => ({
    skill: s.skillName.split('/')[0],
    value: (s.proficiency / 5) * 100,
  }));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dailyHours = days.map((day, i) => {
    const dayLogs = thisWeekLogs.filter(l => {
      const d = new Date(l.date).getDay();
      return d === i + 1;
    });
    return { day, hours: dayLogs.reduce((s, l) => s + l.hours, 0) };
  });

  const suggestedSkills = [
    { name: 'Docker', source: 'AI Inferred', confidence: 87 },
    { name: 'GraphQL', source: 'Peer Endorsement', confidence: 72 },
    { name: 'Kubernetes', source: 'Task History', confidence: 65 },
  ];

  return (
    <div>
      <Topbar title="Overview" />
      <div className="p-6 space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, oklch(0.30 0.15 264), oklch(0.20 0.10 280))' }}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-white/60 text-sm mb-1">Good morning,</div>
              <h2 className="text-2xl font-bold text-white">{currentUser.firstName} {currentUser.lastName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                  {currentUser.department}
                </Badge>
                <span className="text-white/50 text-sm capitalize">{currentUser.role}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-center p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold text-white">{myTasks.length}</div>
                <div className="text-white/60 text-xs">Active Tasks</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold text-white">{totalHours.toFixed(0)}h</div>
                <div className="text-white/60 text-xs">This Week</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold text-white">{currentUser.skills.length}</div>
                <div className="text-white/60 text-xs">Skills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Tasks', value: myTasks.length, icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10', change: '+2 this week' },
            { label: 'Hours Logged', value: `${totalHours.toFixed(0)}h`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', change: `${currentUser.utilization}% utilization` },
            { label: 'Skill Score', value: '78', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', change: '+3 this month' },
            { label: 'Burnout Risk', value: 'Low', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', change: `${currentUser.burnoutScore}/100 score` },
          ].map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm">{card.label}</span>
                <div className={cn('p-2 rounded-xl', card.bg)}>
                  <card.icon className={cn('w-4 h-4', card.color)} />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{card.value}</div>
              <div className="text-muted-foreground text-xs">{card.change}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Tasks</h3>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                  View all <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {myTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  {statusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{task.projectName} · Due {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className={cn('text-xs font-medium', priorityColor[task.priority])}>
                    {task.priority}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Effort this week */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Effort This Week</h3>
              <Link href="/effort">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                  Log <Plus className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2 mb-4">
              {days.map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{day}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${(dailyHours[i].hours / 10) * 100}%`,
                        background: dailyHours[i].hours > 8 ? '#ef4444' : dailyHours[i].hours > 0 ? '#6366f1' : '#e5e7eb',
                      }} />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">
                    {dailyHours[i].hours > 0 ? `${dailyHours[i].hours}h` : '--'}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{totalHours.toFixed(1)}h / 40h</span>
              </div>
              <div className="h-2 rounded-full bg-muted mt-2">
                <div className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${Math.min((totalHours / 40) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Skill radar + suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skill Radar</h3>
              <Link href="/skills">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                  Manage <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="currentColor" className="text-border" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'currentColor', fontSize: 11 }} className="text-muted-foreground" />
                <Radar name="Skills" dataKey="value" fill="#6366f1" fillOpacity={0.25} stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Suggestions */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <Cpu className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="font-semibold">AI-Suggested Skills</h3>
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]">3 new</Badge>
            </div>
            <div className="space-y-3 mb-4">
              {suggestedSkills.map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">{s.confidence}%</div>
                    <div className="text-xs text-muted-foreground">confidence</div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs ml-2">Add</Button>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span>Skills auto-detected from task history & peer activity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Velocity chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Team Velocity</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Tasks completed vs planned per week</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">+14% this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5e7eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e5e7eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="planned" stroke="#d1d5db" fill="url(#plannedGrad)" strokeWidth={1.5} name="Planned" />
              <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#completedGrad)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
