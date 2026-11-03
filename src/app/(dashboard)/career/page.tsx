'use client';

import { useState } from 'react';
import {
  TrendingUp, Target, Brain, Zap, ArrowRight, ChevronRight,
  Star, Clock, BookOpen, Users, CheckCircle2, Lock
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const targetRoles = [
  {
    id: 'r1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    matchScore: 82,
    estimatedWeeks: 8,
    requiredSkills: [
      { name: 'React', current: 5, required: 5, met: true },
      { name: 'TypeScript', current: 4, required: 4, met: true },
      { name: 'Node.js', current: 4, required: 4, met: true },
      { name: 'System Design', current: 3, required: 4, met: false },
      { name: 'AWS', current: 2, required: 3, met: false },
    ],
    recommendations: [
      { type: 'project', text: 'Join Data Pipeline project for AWS exposure', icon: Zap },
      { type: 'course', text: 'AWS Solutions Architect course (16h)', icon: BookOpen },
      { type: 'mentor', text: 'Shadow Alex Rivera on system design decisions', icon: Users },
    ],
  },
  {
    id: 'r2',
    title: 'Tech Lead / Engineering Manager',
    department: 'Engineering',
    matchScore: 64,
    estimatedWeeks: 24,
    requiredSkills: [
      { name: 'Leadership', current: 3, required: 5, met: false },
      { name: 'System Design', current: 3, required: 5, met: false },
      { name: 'Communication', current: 3, required: 4, met: false },
      { name: 'React', current: 5, required: 3, met: true },
      { name: 'Node.js', current: 4, required: 4, met: true },
    ],
    recommendations: [
      { type: 'project', text: 'Lead the Mobile App MVP project', icon: Zap },
      { type: 'course', text: 'Engineering Management Fundamentals', icon: BookOpen },
      { type: 'mentor', text: 'Connect with Engineering Director', icon: Users },
    ],
  },
];

const learningPath = [
  { week: '1-2', milestone: 'Complete AWS Cloud Practitioner', status: 'in_progress', type: 'certification' },
  { week: '3-4', milestone: 'Lead a system design session', status: 'pending', type: 'experience' },
  { week: '5-6', milestone: 'Deploy feature to production independently', status: 'pending', type: 'experience' },
  { week: '7-8', milestone: 'AWS Solutions Architect Associate', status: 'pending', type: 'certification' },
];

const currentRadar = currentUser.skills.slice(0, 6).map(s => ({
  skill: s.skillName.split('/')[0].substring(0, 8),
  current: (s.proficiency / 5) * 100,
  target: s.skillName === 'System Design' ? 80 : s.skillName === 'AWS' ? 60 : (s.proficiency / 5) * 100,
}));

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = useState(targetRoles[0]);

  const gapSkills = selectedRole.requiredSkills.filter(s => !s.met);
  const metSkills = selectedRole.requiredSkills.filter(s => s.met);

  return (
    <div>
      <Topbar title="Career Path" />
      <div className="p-6 space-y-6">
        {/* Current position */}
        <div className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, oklch(0.25 0.10 264), oklch(0.18 0.08 280))' }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10 blur-3xl rounded-full"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Current Position</div>
              <div className="text-2xl font-bold text-white mb-1">Senior Engineer</div>
              <div className="text-white/60 text-sm">Engineering · 5 years exp · 8 skills</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">78</div>
                <div className="text-white/60 text-xs">Skill Score</div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/40" />
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-300">{selectedRole.matchScore}%</div>
                <div className="text-white/60 text-xs">Match Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Target role selector */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-sm">AI-Suggested Career Paths</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targetRoles.map(role => (
              <button key={role.id} onClick={() => setSelectedRole(role)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all',
                  selectedRole.id === role.id
                    ? 'border-indigo-500/40 bg-indigo-500/5'
                    : 'border-border hover:border-indigo-500/20'
                )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{role.title}</span>
                  <span className="text-sm font-bold text-indigo-600">{role.matchScore}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  ~{role.estimatedWeeks} weeks to ready
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail for selected role */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar comparison */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">Skill Gap Visualization</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={currentRadar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Radar name="Target" dataKey="target" fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" />
                <Radar name="Current" dataKey="current" fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 justify-center mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-0.5 bg-indigo-500 rounded" />
                Current
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-0.5 bg-emerald-500 rounded" style={{ borderTop: '2px dashed #10b981', height: 1, background: 'transparent' }} />
                Target
              </div>
            </div>
          </div>

          {/* Skills gap */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">Skills Assessment</h3>

            <div className="mb-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Gaps to Close ({gapSkills.length})</div>
              <div className="space-y-2">
                {gapSkills.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground">{s.current}/5 to {s.required}/5</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-red-400/60 relative overflow-hidden"
                          style={{ width: `${(s.current / 5) * 100}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-400" />
                        </div>
                        <div className="h-full rounded-full bg-emerald-500/30 -mt-1.5"
                          style={{ width: `${(s.required / 5) * 100}%`, maxWidth: '100%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Already Met ({metSkills.length})</div>
              <div className="space-y-1.5">
                {metSkills.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{s.name}</span>
                    <span className="ml-auto text-xs text-emerald-600 font-medium">{s.current}/5</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold text-sm">AI Recommendations</h3>
            </div>
            <div className="space-y-3 mb-4">
              {selectedRole.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-indigo-500/30 transition-colors cursor-pointer">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 flex-shrink-0 mt-0.5">
                    <rec.icon className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="text-sm">{rec.text}</span>
                </div>
              ))}
            </div>
            <Button className="w-full text-white text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Create Learning Plan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Learning timeline */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">8-Week Path to {selectedRole.title}</h3>
            <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-xs">
              AI Generated
            </Badge>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />
            <div className="space-y-4">
              {learningPath.map((item, i) => (
                <div key={i} className="flex items-start gap-4 pl-12 relative">
                  <div className={cn(
                    'absolute left-4 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    item.status === 'in_progress' ? 'border-indigo-500 bg-indigo-500/20' : 'border-border bg-background'
                  )}>
                    {item.status === 'in_progress' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </div>
                  <div className="flex-1 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.milestone}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                        <span className="text-xs text-muted-foreground">Wk {item.week}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
