'use client';

import { useState } from 'react';
import {
  Clock, Plus, CheckCircle, ChevronLeft, ChevronRight, Play, Square,
  AlertCircle, Timer, Check
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { effortLogs, tasks } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DATES = ['Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26'];

const statusConfig = {
  draft: { label: 'Draft', color: 'text-muted-foreground', bg: 'bg-muted' },
  submitted: { label: 'Submitted', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-500/10' },
};

// Build timesheet grid data
const timesheetData = tasks.filter(t => t.assignedTo === 'u1').slice(0, 4).map(task => {
  const taskLogs = effortLogs.filter(l => l.taskId === task.id && l.userId === 'u1');
  const days = DATES.map(date => {
    const log = taskLogs.find(l => l.date === `2026-0${date.split(' ')[1]}`);
    const sep = date.split(' ')[1];
    const log2 = taskLogs.find(l => l.date.endsWith(`-${sep.padStart(2, '0')}`));
    return log2 ? log2.hours : 0;
  });
  return { task, days };
});

export default function EffortPage() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedTask, setSelectedTask] = useState(tasks[0]?.id);
  const [addHours, setAddHours] = useState('');
  const [addNotes, setAddNotes] = useState('');
  const [logs, setLogs] = useState(effortLogs);

  const totalWeekly = logs.filter(l => l.userId === 'u1').reduce((s, l) => s + l.hours, 0);
  const approvedHours = logs.filter(l => l.userId === 'u1' && l.status === 'approved').reduce((s, l) => s + l.hours, 0);
  const pendingCount = logs.filter(l => l.userId === 'u1' && l.status === 'submitted').length;

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const myTasks = tasks.filter(t => t.assignedTo === 'u1' && t.status !== 'completed');

  return (
    <div>
      <Topbar title="Effort Log" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Hours This Week', value: `${totalWeekly.toFixed(1)}h`, sub: 'of 40h target', color: 'text-indigo-500' },
            { label: 'Approved', value: `${approvedHours.toFixed(1)}h`, sub: 'manager approved', color: 'text-emerald-500' },
            { label: 'Pending Review', value: pendingCount, sub: 'entries submitted', color: 'text-blue-500' },
            { label: 'Utilization', value: `${Math.round((totalWeekly / 40) * 100)}%`, sub: 'of 40h capacity', color: 'text-amber-500' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className={cn('text-2xl font-bold mb-1', s.color)}>{s.value}</div>
              <div className="text-sm font-medium mb-0.5">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer + Quick Log */}
          <div className="space-y-4">
            {/* Timer */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Time Tracker</h3>
              <div className="text-center mb-4">
                <div className={cn(
                  'text-4xl font-mono font-bold mb-4 transition-colors',
                  timerRunning ? 'text-indigo-500' : 'text-foreground'
                )}>
                  {formatTime(timerSeconds)}
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    size="lg"
                    className={cn('gap-2 px-6', timerRunning ? 'bg-red-500 hover:bg-red-600 text-white' : '')}
                    style={!timerRunning ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' } : {}}
                    onClick={() => {
                      setTimerRunning(!timerRunning);
                      if (!timerRunning) {
                        const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
                        setTimeout(() => clearInterval(interval), 3600000);
                      }
                    }}>
                    {timerRunning ? <><Square className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start</>}
                  </Button>
                  {timerSeconds > 0 && !timerRunning && (
                    <Button variant="outline" size="sm" onClick={() => setTimerSeconds(0)}>Reset</Button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Task</label>
                <select
                  className="w-full p-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={selectedTask} onChange={e => setSelectedTask(e.target.value)}>
                  {myTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            {/* Quick log */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Quick Log</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Task</label>
                  <select className="w-full p-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {myTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Hours</label>
                    <input type="number" value={addHours} onChange={e => setAddHours(e.target.value)}
                      className="w-full p-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="0.0" min="0" max="24" step="0.5" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Date</label>
                    <input type="date" defaultValue="2026-09-28"
                      className="w-full p-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Notes (optional)</label>
                  <textarea value={addNotes} onChange={e => setAddNotes(e.target.value)}
                    className="w-full p-2 text-sm border border-border rounded-xl bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    rows={2} placeholder="What did you work on?" />
                </div>
                <Button className="w-full text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Plus className="w-4 h-4 mr-2" /> Log Effort
                </Button>
              </div>
            </div>
          </div>

          {/* Weekly timesheet */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Weekly Timesheet</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
                  <span className="text-sm text-muted-foreground">Sep 22 – 26, 2026</span>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-48">Task</th>
                      {DAYS.map((d, i) => (
                        <th key={d} className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">
                          <div>{d}</div>
                          <div className="text-[10px] text-muted-foreground/60">{DATES[i].split(' ')[1]}</div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheetData.map(({ task, days }) => {
                      const total = days.reduce((s, d) => s + d, 0);
                      // Get status from logs
                      const taskLog = logs.find(l => l.taskId === task.id && l.userId === 'u1');
                      const status = taskLog?.status || 'draft';
                      const sc = statusConfig[status];
                      return (
                        <tr key={task.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-xs truncate max-w-44">{task.title}</div>
                            <div className="text-[10px] text-muted-foreground">{task.projectName}</div>
                          </td>
                          {days.map((h, i) => (
                            <td key={i} className="px-3 py-3 text-center">
                              {h > 0 ? (
                                <div className={cn(
                                  'inline-flex items-center justify-center w-12 h-8 rounded-lg text-sm font-medium',
                                  h > 8 ? 'bg-red-500/10 text-red-600' : 'bg-indigo-500/10 text-indigo-600'
                                )}>
                                  {h}h
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-12 h-8 rounded-lg text-muted-foreground/30 text-xs border border-dashed border-border">
                                  —
                                </div>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-semibold">{total.toFixed(1)}h</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className={cn('text-[10px] border-0 capitalize', sc.bg, sc.color)}>{sc.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Totals row */}
                    <tr className="bg-muted/30 font-semibold">
                      <td className="px-4 py-3 text-sm">Daily Total</td>
                      {DAYS.map((d, i) => {
                        const total = timesheetData.reduce((s, { days }) => s + days[i], 0);
                        return (
                          <td key={d} className="px-3 py-3 text-center">
                            <span className={cn('text-sm font-bold', total > 8 ? 'text-red-500' : total > 0 ? 'text-indigo-600' : 'text-muted-foreground')}>
                              {total > 0 ? `${total.toFixed(1)}h` : '—'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center text-sm font-bold text-indigo-600">
                        {timesheetData.reduce((s, { days }) => s + days.reduce((a, b) => a + b, 0), 0).toFixed(1)}h
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer actions */}
              <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  {pendingCount} entries pending manager approval
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">Save Draft</Button>
                  <Button size="sm" className="h-7 text-xs text-white" style={{ background: '#6366f1' }}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Submit Week
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
