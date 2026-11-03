'use client';

import { useState } from 'react';
import {
  Shield, Users, Settings, Activity, Plus, Search, Edit2, Trash2,
  CheckCircle, XCircle, Eye, Download, Filter, Clock
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { teamMembers, skillTaxonomy } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const auditLogs = [
  { id: 'a1', actor: 'Alex Rivera', action: 'task.assigned', entity: 'Task: Write unit tests', details: 'Assigned to Sarah Chen', ts: '2026-09-28T14:30:00Z', type: 'task' },
  { id: 'a2', actor: 'Sarah Chen', action: 'effort.submitted', entity: 'Timesheet: Sep 23-25', details: '24.5 hours submitted for review', ts: '2026-09-27T09:00:00Z', type: 'effort' },
  { id: 'a3', actor: 'Alex Rivera', action: 'effort.approved', entity: 'Timesheet: Sarah Chen Sep 23-24', details: '14.5 hours approved', ts: '2026-09-27T10:00:00Z', type: 'effort' },
  { id: 'a4', actor: 'Admin', action: 'user.created', entity: 'User: Priya Patel', details: 'New user registered as Frontend Engineer', ts: '2026-09-20T08:00:00Z', type: 'user' },
  { id: 'a5', actor: 'Marcus Johnson', action: 'skill.added', entity: 'Skill: Kubernetes', details: 'Self-assessed at level 4', ts: '2026-09-19T16:00:00Z', type: 'skill' },
  { id: 'a6', actor: 'Alex Rivera', action: 'skill.endorsed', entity: 'Sarah Chen: React', details: 'Manager endorsed React (level 5)', ts: '2026-09-18T14:00:00Z', type: 'skill' },
];

const actionColors: Record<string, string> = {
  task: 'bg-indigo-500/10 text-indigo-600',
  effort: 'bg-blue-500/10 text-blue-600',
  user: 'bg-emerald-500/10 text-emerald-600',
  skill: 'bg-amber-500/10 text-amber-600',
};

const roleColors = {
  employee: 'bg-blue-500/10 text-blue-600',
  manager: 'bg-indigo-500/10 text-indigo-600',
  admin: 'bg-red-500/10 text-red-600',
  executive: 'bg-amber-500/10 text-amber-600',
};

type AdminTab = 'users' | 'skills' | 'audit' | 'settings';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('users');
  const [search, setSearch] = useState('');

  const tabs: { id: AdminTab; label: string; icon: typeof Shield }[] = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'skills', label: 'Skill Library', icon: Activity },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div>
      <Topbar title="Admin Panel" />
      <div className="p-6 space-y-6">
        {/* Tab nav */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                tab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search users..." />
              </div>
              <Button size="sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }} className="text-xs gap-1.5">
                <Plus className="w-4 h-4" /> Add User
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['User', 'Role', 'Department', 'Status', 'Utilization', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamMembers
                    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                    .map(member => (
                      <tr key={member.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs border-0 capitalize',
                            member.name === 'Alex Rivera' ? roleColors.manager : roleColors.employee)}>
                            {member.name === 'Alex Rivera' ? 'Manager' : 'Employee'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{member.department}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-emerald-600">Active</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${member.utilization}%` }} />
                            </div>
                            <span className="text-xs">{member.utilization}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-red-500 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Skills Library Tab */}
        {tab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search skills..." />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
              <Button size="sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }} className="text-xs gap-1.5">
                <Plus className="w-4 h-4" /> Add Skill
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Skill', 'Category', 'Users', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skillTaxonomy.map(skill => {
                    const catColors: Record<string, string> = {
                      technical: 'bg-blue-500/10 text-blue-600',
                      soft: 'bg-pink-500/10 text-pink-600',
                      domain: 'bg-purple-500/10 text-purple-600',
                      tool: 'bg-emerald-500/10 text-emerald-600',
                      certification: 'bg-amber-500/10 text-amber-600',
                    };
                    const userCount = teamMembers.filter(m => m.skills.some(s => s.skillName === skill.name)).length;
                    return (
                      <tr key={skill.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{skill.name}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs border-0 capitalize', catColors[skill.category])}>
                            {skill.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">{userCount} users</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {tab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search audit logs..." />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="divide-y divide-border">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                    <div className={cn('p-2 rounded-lg mt-0.5 flex-shrink-0', actionColors[log.type])}>
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium">{log.actor}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <Badge className={cn('text-[10px] border-0', actionColors[log.type])}>
                          {log.action}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{log.entity}</div>
                      <div className="text-xs text-muted-foreground/70 mt-0.5">{log.details}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(log.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-4 max-w-2xl">
            {[
              { title: 'Effort Entry Window', desc: 'Max days employees can retroactively log effort', value: '2 days' },
              { title: 'Weekly Hours Threshold', desc: 'Hours above this trigger overtime alert', value: '45 hours' },
              { title: 'Burnout Alert Threshold', desc: 'Risk score above this notifies manager', value: '60 points' },
              { title: 'AI Match Suggestions', desc: 'Show AI matching recommendations in task assignment', value: 'Enabled' },
              { title: 'Auto Skill Discovery', desc: 'Automatically suggest skills from completed tasks', value: 'Enabled' },
            ].map(setting => (
              <div key={setting.title} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
                <div>
                  <div className="font-medium text-sm">{setting.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{setting.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{setting.value}</span>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
