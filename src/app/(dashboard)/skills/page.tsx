'use client';

import { useState } from 'react';
import {
  Zap, Plus, Check, Brain, Star, Shield, ChevronDown, Edit3, Award, Users
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser, skillTaxonomy } from '@/lib/mock-data';
import type { SkillCategory, ProficiencyLevel } from '@/types';
import { PROFICIENCY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

const categoryConfig: Record<SkillCategory, { label: string; color: string; bg: string }> = {
  technical: { label: 'Technical', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  soft: { label: 'Soft Skills', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10' },
  domain: { label: 'Domain', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  certification: { label: 'Certifications', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  tool: { label: 'Tools', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
};

const profColors = ['', '#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#10b981'];

function ProficiencyBar({ level }: { level: ProficiencyLevel }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-2 w-6 rounded-sm transition-all"
          style={{ background: i <= level ? profColors[level] : 'hsl(var(--muted))' }} />
      ))}
    </div>
  );
}

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? currentUser.skills
    : currentUser.skills.filter(s => s.category === activeCategory);

  const radarData = currentUser.skills.slice(0, 8).map(s => ({
    skill: s.skillName.split('/')[0].substring(0, 8),
    value: (s.proficiency / 5) * 100,
    full: 100,
  }));

  const categories = ['all', 'technical', 'soft', 'domain', 'tool'] as const;
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'all' ? currentUser.skills.length : currentUser.skills.filter(s => s.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  // Suggested skills from AI
  const suggested = [
    { name: 'Docker', confidence: 87, reason: 'Detected in 3 recent tasks', category: 'tool' as SkillCategory },
    { name: 'GraphQL', confidence: 72, reason: 'Peer endorsement from Marcus', category: 'technical' as SkillCategory },
    { name: 'Kubernetes', confidence: 65, reason: 'Related to your AWS skills', category: 'tool' as SkillCategory },
  ];

  return (
    <div>
      <Topbar title="Skills" />
      <div className="p-6 space-y-6">
        {/* Header + radar side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill radar */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Skill Radar</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Radar name="Skills" dataKey="full" fill="transparent" stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <Radar name="You" dataKey="value" fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" strokeWidth={2}
                  dot={{ r: 3, fill: '#6366f1' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Skills', value: currentUser.skills.length, color: 'text-indigo-500' },
                { label: 'Verified', value: currentUser.skills.filter(s => s.verified).length, color: 'text-emerald-500' },
                { label: 'Endorsements', value: currentUser.skills.reduce((s, skill) => s + skill.endorsements, 0), color: 'text-blue-500' },
                { label: 'Expert Level', value: currentUser.skills.filter(s => s.proficiency === 5).length, color: 'text-amber-500' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span className="font-medium text-sm">AI-Suggested Skills</span>
                <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]">3 new</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {suggested.map(s => {
                  const cc = categoryConfig[s.category];
                  return (
                    <div key={s.name} className="p-3 rounded-xl border border-border hover:border-indigo-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-xs font-semibold text-indigo-600">{s.confidence}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{s.reason}</div>
                      <Button size="sm" variant="outline" className="w-full h-6 text-[10px] group-hover:border-indigo-500/40">
                        <Plus className="w-3 h-3 mr-1" /> Add Skill
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize',
                activeCategory === cat
                  ? 'bg-indigo-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}>
              {cat === 'all' ? 'All' : categoryConfig[cat as SkillCategory].label}
              <span className={cn('ml-1.5', activeCategory === cat ? 'text-white/70' : 'text-muted-foreground/60')}>
                {categoryCounts[cat]}
              </span>
            </button>
          ))}
        </div>

        {/* Skills list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold">My Skills ({filtered.length})</span>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </Button>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((skill) => {
              const cc = categoryConfig[skill.category];
              const expanded = expandedSkill === skill.id;
              return (
                <div key={skill.id} className="cursor-pointer">
                  <div
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedSkill(expanded ? null : skill.id)}>
                    {/* Skill name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{skill.skillName}</span>
                        {skill.verified && <Shield className="w-3.5 h-3.5 text-emerald-500" />}
                        <Badge className={cn('text-[9px] px-1.5 py-0 border-0 capitalize', cc.bg, cc.color)}>
                          {cc.label}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 capitalize">{skill.source.replace('_', ' ')}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Last used: {skill.lastUsed ? new Date(skill.lastUsed).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
                      </div>
                    </div>

                    {/* Proficiency */}
                    <div className="flex items-center gap-3">
                      <ProficiencyBar level={skill.proficiency} />
                      <span className="text-xs font-medium text-muted-foreground min-w-20">
                        {PROFICIENCY_LABELS[skill.proficiency]}
                      </span>
                    </div>

                    {/* Endorsements */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-12">
                      <Users className="w-3.5 h-3.5" />
                      {skill.endorsements}
                    </div>

                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
                  </div>

                  {/* Expanded */}
                  {expanded && (
                    <div className="px-5 pb-4 bg-muted/20 border-t border-border/50">
                      <div className="pt-3 flex items-center gap-3 flex-wrap">
                        <div className="text-xs text-muted-foreground">
                          Proficiency: {skill.proficiency}/5 — {PROFICIENCY_LABELS[skill.proficiency]}
                        </div>
                        {[1, 2, 3, 4, 5].map(p => (
                          <button key={p} onClick={(e) => e.stopPropagation()}
                            className={cn(
                              'px-3 py-1 rounded-lg text-xs font-medium transition-all border',
                              skill.proficiency === p
                                ? 'text-white border-transparent'
                                : 'border-border text-muted-foreground hover:border-indigo-500/30'
                            )}
                            style={skill.proficiency === p ? { background: profColors[p] } : {}}>
                            {p} — {PROFICIENCY_LABELS[p as ProficiencyLevel]}
                          </button>
                        ))}
                        <Button size="sm" variant="outline" className="ml-auto h-7 text-xs gap-1">
                          <Edit3 className="w-3 h-3" /> Update
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
