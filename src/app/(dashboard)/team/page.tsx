'use client';

import { useState } from 'react';
import {
  Users, AlertTriangle, CheckSquare, Brain, TrendingUp, ChevronRight,
  Activity, Cpu, ArrowRight, Shield, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  teamMembers, tasks, burnoutSnapshots, skillMatchCandidates, workloadData, skillHeatmapData
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const burnoutBandColor = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', bar: '#10b981' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', bar: '#f59e0b' },
  high: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', bar: '#ef4444' },
  critical: { bg: 'bg-red-900/20', text: 'text-red-500', border: 'border-red-500/30', bar: '#b91c1c' },
};

const heatmapColor = (v: number) => {
  if (v === 0) return { bg: 'bg-muted', text: 'text-muted-foreground' };
  if (v >= 5) return { bg: 'bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' };
  if (v >= 4) return { bg: 'bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400' };
  if (v >= 3) return { bg: 'bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400' };
  if (v >= 2) return { bg: 'bg-orange-500/20', text: 'text-orange-700 dark:text-orange-400' };
  return { bg: 'bg-red-500/20', text: 'text-red-700 dark:text-red-400' };
};

export default function TeamPage() {
  const [selectedTask, setSelectedTask] = useState(tasks.find(t => !t.assignedTo && t.status === 'open'));
  const openTasks = tasks.filter(t => !t.assignedTo || t.status === 'open');
  const atRisk = burnoutSnapshots.filter(b => b.riskBand === 'high' || b.riskBand === 'critical');

  return (
    <div>
      <Topbar title="Team Management" />
      <div className="p-6 space-y-6">
        {/* Header stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Team Size', value: teamMembers.length, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Open Tasks', value: openTasks.length, icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'At Risk', value: atRisk.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', alert: true },
            { label: 'Avg Utilization', value: `${Math.round(workloadData.reduce((s, m) => s + m.utilization, 0) / workloadData.length)}%`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map((card) => (
            <div key={card.label} className={cn('bg-card border rounded-2xl p-5', card.alert ? 'border-red-500/30' : 'border-border')}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm">{card.label}</span>
                <div className={cn('p-2 rounded-xl', card.bg)}>
                  <card.icon className={cn('w-4 h-4', card.color)} />
                </div>
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Burnout alerts */}
        {atRisk.length > 0 && (
          <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-600 text-sm">Burnout Alerts — {atRisk.length} team member{atRisk.length > 1 ? 's' : ''} at high risk</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {atRisk.map(b => {
                const member = teamMembers.find(m => m.id === b.userId);
                if (!member) return null;
                return (
                  <div key={b.userId} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-xs font-bold text-red-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">Score: {b.riskScore}/100 · {member.weeklyHours}h this week</div>
                    </div>
                    <Badge className={cn(burnoutBandColor[b.riskBand].bg, burnoutBandColor[b.riskBand].text, burnoutBandColor[b.riskBand].border, 'text-xs capitalize')}>
                      {b.riskBand}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Workload chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Team Workload Distribution</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Current week utilization vs. capacity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workloadData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => v.split(' ')[0]} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="hours" name="Hours Logged" radius={[6, 6, 0, 0]}>
                {workloadData.map((entry) => (
                  <Cell key={entry.name} fill={entry.utilization > 90 ? '#ef4444' : entry.utilization > 75 ? '#f59e0b' : '#6366f1'} />
                ))}
              </Bar>
              <Bar dataKey="capacity" name="Capacity (40h)" fill="#e5e7eb" opacity={0.4} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill heatmap + AI Matcher side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Skill heatmap */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Team Skill Heatmap</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-muted-foreground pb-2 w-24">Member</th>
                    {skillHeatmapData.skills.map(s => (
                      <th key={s} className="text-center text-xs text-muted-foreground pb-2 px-1 min-w-14">
                        {s.split('/')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skillHeatmapData.members.map((member, mi) => (
                    <tr key={member}>
                      <td className="py-1 pr-3 text-xs font-medium">{member}</td>
                      {skillHeatmapData.matrix[mi].map((val, si) => {
                        const c = heatmapColor(val);
                        return (
                          <td key={si} className="py-1 px-1 text-center">
                            <div className={cn('mx-auto w-9 h-7 rounded-lg flex items-center justify-center text-xs font-bold', c.bg, c.text)}>
                              {val > 0 ? val : '—'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Legend */}
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {[
                  { label: 'Expert (5)', color: 'bg-emerald-500/20 text-emerald-700' },
                  { label: 'Advanced (4)', color: 'bg-blue-500/20 text-blue-700' },
                  { label: 'Intermediate (3)', color: 'bg-amber-500/20 text-amber-700' },
                  { label: 'Novice (2)', color: 'bg-orange-500/20 text-orange-700' },
                  { label: 'Beginner (1)', color: 'bg-red-500/20 text-red-700' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={cn('w-5 h-4 rounded text-[9px] flex items-center justify-center font-bold', l.color)}>
                      {l.label[0]}
                    </div>
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Task Matcher */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <Brain className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="font-semibold">AI Task Matcher</h3>
            </div>

            {/* Task selector */}
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">Select a task to match:</div>
              <div className="space-y-1">
                {openTasks.slice(0, 3).map(t => (
                  <button key={t.id} onClick={() => setSelectedTask(t)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all',
                      selectedTask?.id === t.id
                        ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                        : 'border border-border hover:border-indigo-500/20 hover:bg-muted/50'
                    )}>
                    <div className="font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.requiredSkills.slice(0, 2).map(s => s.skillName).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Match results */}
            {selectedTask && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-indigo-500" />
                  Top candidates for this task:
                </div>
                {skillMatchCandidates.map((c, i) => (
                  <div key={c.userId} className={cn(
                    'p-3 rounded-xl border transition-all',
                    i === 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#f59e0b' }}>
                        #{i + 1}
                      </div>
                      <span className="text-sm font-medium">{c.userName}</span>
                      <span className="ml-auto text-sm font-bold" style={{ color: i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#f59e0b' }}>
                        {Math.round(c.matchScore * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{c.reasons[0]}</div>
                    {i === 0 && (
                      <Button size="sm" className="w-full mt-2 h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                        Assign Task <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team members list */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Members</h3>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Users className="w-3 h-3 mr-1.5" /> Add Member
            </Button>
          </div>
          <div className="space-y-2">
            {teamMembers.map((member) => {
              const burnout = burnoutSnapshots.find(b => b.userId === member.id);
              const bc = burnoutBandColor[member.burnoutBand];
              return (
                <div key={member.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role} · {member.activeTasks} active tasks</div>
                  </div>
                  {/* Skills pills */}
                  <div className="hidden md:flex items-center gap-1.5 flex-1">
                    {member.skills.slice(0, 3).map(s => (
                      <Badge key={s.id} variant="secondary" className="text-xs">{s.skillName}</Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{member.skills.length - 3}</Badge>
                    )}
                  </div>
                  {/* Utilization */}
                  <div className="text-right min-w-24">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted w-20">
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${member.utilization}%`,
                            background: member.utilization > 90 ? '#ef4444' : member.utilization > 75 ? '#f59e0b' : '#6366f1',
                          }} />
                      </div>
                      <span className={cn('text-xs font-medium', member.utilization > 90 ? 'text-red-500' : member.utilization > 75 ? 'text-amber-500' : 'text-foreground')}>
                        {member.utilization}%
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Badge className={cn('text-[10px] border capitalize', bc.bg, bc.text, bc.border)}>
                        {member.burnoutBand}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
