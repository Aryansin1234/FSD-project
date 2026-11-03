'use client';

import { useState } from 'react';
import {
  FolderKanban, Plus, CheckCircle2, Clock, Users, TrendingUp,
  AlertCircle, Brain, ChevronRight, Calendar, ArrowRight, Cpu
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects, tasks, teamMembers } from '@/lib/mock-data';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

const healthConfig = {
  on_track: { label: 'On Track', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  at_risk: { label: 'At Risk', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  delayed: { label: 'Delayed', color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const statusConfig = {
  planning: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  active: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  on_hold: { color: 'text-amber-500', bg: 'bg-amber-500/10' },
  completed: { color: 'text-muted-foreground', bg: 'bg-muted' },
  archived: { color: 'text-muted-foreground', bg: 'bg-muted' },
};

function ProjectCard({ project }: { project: Project }) {
  const hc = healthConfig[project.health];
  const sc = statusConfig[project.status];
  const progress = project.tasksTotal > 0 ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) : 0;
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  return (
    <div className={cn('bg-card border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group', project.health === 'at_risk' ? 'border-amber-500/30' : 'border-border hover:border-indigo-500/30')}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="font-semibold text-base mb-1 truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Badge className={cn('text-xs border-0 capitalize', sc.bg, sc.color)}>{project.status.replace('_', ' ')}</Badge>
          <Badge className={cn('text-xs border capitalize', hc.bg, hc.color, hc.border)}>{hc.label}</Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.tasksCompleted}/{project.tasksTotal} tasks</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: project.health === 'at_risk' ? '#f59e0b' : project.health === 'delayed' ? '#ef4444' : '#6366f1',
            }} />
        </div>
        <div className="text-right text-xs text-muted-foreground mt-1">{progress}% complete</div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-sm font-semibold">{project.teamSize}</div>
          <div className="text-[10px] text-muted-foreground">Team</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-sm font-semibold">{projectTasks.filter(t => t.status === 'in_progress').length}</div>
          <div className="text-[10px] text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold">
            {Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7))}w
          </div>
          <div className="text-[10px] text-muted-foreground">Remaining</div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3 h-3" />
        {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
        {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">View Tasks</Button>
        <Button size="sm" className="h-7 text-xs px-3" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

function TeamOptimizer() {
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState(false);

  const optimize = async () => {
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 2000));
    setOptimizing(false);
    setResult(true);
  };

  const suggestedTeams = [
    {
      rank: 1, coverage: 94, score: 91,
      members: ['Sarah Chen', 'Marcus Johnson', 'David Kim'],
      reasons: ['97% skill coverage', 'Balanced workload (<80% each)', 'Previous collaboration history'],
    },
    {
      rank: 2, coverage: 88, score: 83,
      members: ['Priya Patel', 'Marcus Johnson', 'Alex Rivera'],
      reasons: ['88% skill coverage', 'Strong Node.js + React coverage', 'Leadership included'],
    },
    {
      rank: 3, coverage: 82, score: 76,
      members: ['Sarah Chen', 'David Kim', 'Alex Rivera'],
      reasons: ['82% skill coverage', 'DevOps + Frontend covered', 'Some skill gaps in backend'],
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/10">
          <Cpu className="w-4 h-4 text-indigo-500" />
        </div>
        <h3 className="font-semibold">AI Team Optimizer</h3>
        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-xs">Beta</Badge>
      </div>

      {!result ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Describe your project requirements and let AI suggest the optimal team composition.
          </p>
          <textarea
            className="w-full p-3 rounded-xl border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={3}
            placeholder="e.g. We need to build a payment gateway with React frontend, Node.js API, PostgreSQL database, and AWS deployment. Timeline: 6 weeks."
            defaultValue="Build a payment gateway integration with React frontend, Node.js backend, and AWS deployment. Estimated 6 weeks, need full-stack + DevOps coverage."
          />
          <Button className="w-full text-white" disabled={optimizing}
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            onClick={optimize}>
            {optimizing ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Analyzing team...</>
            ) : (
              <><Brain className="w-4 h-4 mr-2" />Optimize Team Composition</>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            3 optimal team compositions found
          </div>
          {suggestedTeams.map((team) => (
            <div key={team.rank} className={cn(
              'p-4 rounded-xl border transition-all',
              team.rank === 1 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                  team.rank === 1 ? 'bg-emerald-500' : team.rank === 2 ? 'bg-indigo-500' : 'bg-muted-foreground')}>
                  #{team.rank}
                </div>
                <span className="text-sm font-medium">Team Option {team.rank}</span>
                <span className="ml-auto text-sm font-bold"
                  style={{ color: team.rank === 1 ? '#10b981' : team.rank === 2 ? '#6366f1' : '#6b7280' }}>
                  {team.score}% score
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {team.members.map(m => (
                  <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">{team.reasons[0]}</div>
              {team.rank === 1 && (
                <Button size="sm" className="w-full mt-2 h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                  Assign This Team <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setResult(false)}>
            Try Different Requirements
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div>
      <Topbar title="Projects" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, color: 'text-indigo-500', icon: FolderKanban },
            { label: 'Total Tasks', value: projects.reduce((s, p) => s + p.tasksTotal, 0), color: 'text-blue-500', icon: CheckCircle2 },
            { label: 'Completed', value: projects.reduce((s, p) => s + p.tasksCompleted, 0), color: 'text-emerald-500', icon: TrendingUp },
            { label: 'At Risk', value: projects.filter(p => p.health === 'at_risk').length, color: 'text-amber-500', icon: AlertCircle },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">{s.label}</span>
                <s.icon className={cn('w-4 h-4', s.color)} />
              </div>
              <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Projects + Optimizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">All Projects</h3>
              <Button size="sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }} className="text-xs gap-1.5">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>

          <div>
            <TeamOptimizer />
          </div>
        </div>
      </div>
    </div>
  );
}
