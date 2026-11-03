'use client';

import { useState } from 'react';
import {
  BarChart3, TrendingUp, AlertTriangle, Activity, Cpu, ArrowUpRight,
  Download, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  velocityData, burnoutTrendData, workloadData, skillHeatmapData, teamMembers, burnoutSnapshots
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const burnoutBandColor = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', fill: '#10b981' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', fill: '#f59e0b' },
  high: { bg: 'bg-red-500/10', text: 'text-red-600', fill: '#ef4444' },
  critical: { bg: 'bg-red-900/20', text: 'text-red-500', fill: '#b91c1c' },
};

const heatColor = (v: number) => {
  if (v === 0) return 'bg-muted';
  if (v >= 5) return 'bg-emerald-500';
  if (v >= 4) return 'bg-blue-500';
  if (v >= 3) return 'bg-amber-500';
  if (v >= 2) return 'bg-orange-500';
  return 'bg-red-500';
};

const heatOpacity = (v: number) => {
  if (v === 0) return 'opacity-20';
  return `opacity-${Math.round((v / 5) * 100)}`;
};

type Tab = 'overview' | 'burnout' | 'skills' | 'velocity';

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'burnout', label: 'Burnout Analysis' },
    { id: 'skills', label: 'Skill Heatmap' },
    { id: 'velocity', label: 'Velocity' },
  ];

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 space-y-6">
        {/* Tab nav */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                tab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Avg Match Acceptance', value: '78%', trend: '+5%', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { label: 'Avg Time to Assign', value: '2.3h', trend: '-45min', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Effort Log Compliance', value: '92%', trend: '+3%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Team Utilization', value: '73%', trend: '+8%', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5">
                  <div className={cn('text-2xl font-bold mb-1', kpi.color)}>{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mb-2">{kpi.label}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {kpi.trend} vs last week
                  </div>
                </div>
              ))}
            </div>

            {/* Workload + Velocity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Workload Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={workloadData} layout="vertical" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={v => v.split(' ')[0]} width={50} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                    <Bar dataKey="hours" name="Hours" radius={[0, 6, 6, 0]}>
                      {workloadData.map(e => (
                        <Cell key={e.name} fill={e.utilization > 90 ? '#ef4444' : e.utilization > 75 ? '#f59e0b' : '#6366f1'} />
                      ))}
                    </Bar>
                    <Bar dataKey="capacity" name="Capacity" fill="#e5e7eb" opacity={0.3} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Task Velocity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={velocityData}>
                    <defs>
                      <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="planned" stroke="#d1d5db" fill="none" strokeDasharray="4 4" name="Planned" />
                    <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#ag1)" strokeWidth={2} name="Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Burnout Tab */}
        {tab === 'burnout' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map(member => {
                const snap = burnoutSnapshots.find(b => b.userId === member.id);
                if (!snap) return null;
                const bc = burnoutBandColor[snap.riskBand];
                return (
                  <div key={member.id} className={cn('bg-card border rounded-2xl p-5 transition-all', snap.riskBand === 'high' ? 'border-red-500/40' : 'border-border')}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge className={cn('ml-auto capitalize text-xs border', bc.bg, bc.text)}>{snap.riskBand}</Badge>
                    </div>

                    {/* Risk gauge */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Risk Score</span>
                        <span className={cn('font-bold', bc.text)}>{snap.riskScore}/100</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${snap.riskScore}%`, background: bc.fill }} />
                      </div>
                    </div>

                    {/* Contributing factors */}
                    <div className="space-y-1.5">
                      {snap.contributingFactors.overtimeHours ? (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Overtime hours</span>
                          <span className={snap.contributingFactors.overtimeHours > 5 ? 'text-red-500 font-medium' : 'text-foreground'}>
                            +{snap.contributingFactors.overtimeHours}h
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Active tasks</span>
                        <span className={member.activeTasks > 6 ? 'text-red-500 font-medium' : 'text-foreground'}>{member.activeTasks}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Weekly hours</span>
                        <span className={member.weeklyHours > 45 ? 'text-red-500 font-medium' : 'text-foreground'}>{member.weeklyHours}h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trend chart */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Burnout Risk Trend (5 Weeks)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={burnoutTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                  <Legend />
                  {[
                    { key: 'sarah', color: '#6366f1' },
                    { key: 'marcus', color: '#ef4444' },
                    { key: 'priya', color: '#10b981' },
                    { key: 'david', color: '#3b82f6' },
                    { key: 'alex', color: '#f59e0b' },
                  ].map(m => (
                    <Line key={m.key} type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2}
                      dot={{ r: 3 }} name={m.key.charAt(0).toUpperCase() + m.key.slice(1)} />
                  ))}
                  {/* Reference line at 60 */}
                  <line x1="0" x2="100%" y1="60" y2="60" stroke="#ef4444" strokeDasharray="4 4" opacity={0.5} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-px bg-red-400" style={{ borderTop: '2px dashed #ef4444' }} />
                <span className="text-xs text-muted-foreground">High risk threshold (60)</span>
              </div>
            </div>
          </div>
        )}

        {/* Skills Heatmap Tab */}
        {tab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Team Skill Gap Heatmap</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">Proficiency levels by team member and skill</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
                  <Download className="w-3 h-3" /> Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${skillHeatmapData.skills.length}, 1fr)` }}>
                    {/* Header */}
                    <div />
                    {skillHeatmapData.skills.map(s => (
                      <div key={s} className="text-[10px] text-muted-foreground text-center pb-2 font-medium px-1">
                        {s.split('/')[0]}
                      </div>
                    ))}

                    {/* Rows */}
                    {skillHeatmapData.members.map((member, mi) => (
                      <>
                        <div key={`name-${member}`} className="text-xs font-medium py-1 pr-2 flex items-center">{member}</div>
                        {skillHeatmapData.matrix[mi].map((val, si) => {
                          const colors = ['bg-muted', 'bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'];
                          return (
                            <div key={si} className="py-1 px-0.5">
                              <div className={cn('h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer', colors[val])}
                                style={{ opacity: val === 0 ? 0.3 : 0.7 + val * 0.06 }}
                                title={`${member} - ${skillHeatmapData.skills[si]}: ${val > 0 ? `Level ${val}` : 'No skill'}`}>
                                {val > 0 ? val : '·'}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {[
                  { level: 0, label: 'No Skill', color: 'bg-muted' },
                  { level: 1, label: 'Beginner', color: 'bg-red-500' },
                  { level: 2, label: 'Novice', color: 'bg-orange-500' },
                  { level: 3, label: 'Intermediate', color: 'bg-amber-400' },
                  { level: 4, label: 'Advanced', color: 'bg-blue-500' },
                  { level: 5, label: 'Expert', color: 'bg-emerald-500' },
                ].map(l => (
                  <div key={l.level} className="flex items-center gap-1.5">
                    <div className={cn('w-4 h-4 rounded', l.color)} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill gap summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { skill: 'AWS', gap: 'Medium', avgLevel: 2.8, needed: 4, color: 'text-amber-600', bg: 'bg-amber-500/10' },
                { skill: 'Python', gap: 'High', avgLevel: 2.0, needed: 4, color: 'text-red-600', bg: 'bg-red-500/10' },
                { skill: 'Docker', gap: 'Low', avgLevel: 3.4, needed: 4, color: 'text-blue-600', bg: 'bg-blue-500/10' },
              ].map(g => (
                <div key={g.skill} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{g.skill}</span>
                    <Badge className={cn('text-xs border-0', g.bg, g.color)}>{g.gap} Gap</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Team avg: {g.avgLevel.toFixed(1)}/5 · Required: {g.needed}/5
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${(g.avgLevel / 5) * 100}%`, background: g.gap === 'High' ? '#ef4444' : g.gap === 'Medium' ? '#f59e0b' : '#3b82f6' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Velocity Tab */}
        {tab === 'velocity' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Task Completion Velocity</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={velocityData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="planned" name="Planned" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Avg Completion Rate', value: '108%', desc: 'Above planned consistently' },
                { label: 'Sprint Accuracy', value: '87%', desc: 'Tasks matching estimate' },
                { label: 'Trend', value: '+14%', desc: 'Month-over-month velocity' },
              ].map(m => (
                <div key={m.label} className="bg-card border border-border rounded-2xl p-5 text-center">
                  <div className="text-2xl font-bold text-indigo-500 mb-1">{m.value}</div>
                  <div className="text-xs font-medium mb-0.5">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
