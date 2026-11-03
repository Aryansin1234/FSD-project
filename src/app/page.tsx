'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Cpu, Zap, BarChart3, Users, TrendingUp, Brain, ChevronRight,
  CheckCircle, ArrowRight, Star, Shield, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Brain,
    title: 'AI Task Matching',
    description: 'Multi-factor scoring engine matches tasks to employees with 94%+ accuracy. Full explainability on every recommendation.',
    color: 'from-indigo-500 to-violet-500',
    metric: '94% match accuracy',
  },
  {
    icon: BarChart3,
    title: 'Burnout Prediction',
    description: 'Detect employee burnout risk 4-6 weeks before visible symptoms. XGBoost + LSTM models analyze behavioral signals.',
    color: 'from-emerald-500 to-teal-500',
    metric: '4-6 weeks early warning',
  },
  {
    icon: Zap,
    title: 'Live Skill Profiles',
    description: 'Dynamic skill graphs auto-update from task history. NLP extracts skills you have but never reported.',
    color: 'from-amber-500 to-orange-500',
    metric: 'Auto-updated daily',
  },
  {
    icon: Users,
    title: 'Team Optimizer',
    description: 'AI recommends optimal team compositions for new projects. Balances skill coverage, workload, and collaboration history.',
    color: 'from-blue-500 to-cyan-500',
    metric: '3 optimal teams ranked',
  },
  {
    icon: TrendingUp,
    title: 'Career Intelligence',
    description: 'Personalized growth paths based on your skill vector. Recommends learning, projects, and mentors to close gaps.',
    color: 'from-pink-500 to-rose-500',
    metric: '30% more internal mobility',
  },
  {
    icon: Shield,
    title: 'Skill Gap Analysis',
    description: 'Real-time heatmaps across departments. Red/yellow/green gap severity with hiring & training recommendations.',
    color: 'from-purple-500 to-violet-500',
    metric: 'Real-time visibility',
  },
];

const stats = [
  { value: '60%', label: 'Less allocation time' },
  { value: '4.6wk', label: 'Early burnout warning' },
  { value: '94%', label: 'AI match accuracy' },
  { value: '30%', label: 'More internal moves' },
];

const roles = [
  { label: 'Employee', desc: 'Personal skill radar, task inbox, career growth', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Manager', desc: 'Team heatmap, AI matching, workload balancer', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'Admin', desc: 'Org skill inventory, workforce planning, audit logs', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Executive', desc: 'Strategic insights, trend reports, skill forecasting', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature((p) => (p + 1) % features.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.08 0.03 264)' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5"
        style={{ background: 'rgba(10,8,28,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">SkillForge</span>
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">AI-Powered</Badge>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#roles" className="hover:text-white transition-colors">For Your Role</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 text-sm">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-8"
            style={{ background: 'rgba(99,102,241,0.1)' }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-white/70">AI-Powered Workforce Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Right Person.{' '}
            <span className="gradient-text">Right Task.</span>
            <br />Right Time.
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillForge builds living intelligence profiles of your workforce,
            uses AI to match tasks with precision, and predicts burnout before it happens.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login">
              <Button size="lg" className="text-base font-semibold px-8 h-12 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                Launch Dashboard
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/20 text-white/80 hover:bg-white/5 hover:text-white">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/10 text-center"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <div className="flex-1 mx-4 px-4 py-1 rounded-md text-xs text-white/30 text-center border border-white/10"
                style={{ background: 'rgba(0,0,0,0.2)' }}>
                app.skillforge.io/overview
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="p-8 grid grid-cols-3 gap-4" style={{ background: 'oklch(0.10 0.02 264)' }}>
              {/* Stats row */}
              {[
                { label: 'Active Tasks', value: '5', change: '+2 this week', color: '#6366f1' },
                { label: 'Hours This Week', value: '38h', change: '95% of target', color: '#10b981' },
                { label: 'Skill Score', value: '78', change: '+3 from last month', color: '#f59e0b' },
              ].map((card) => (
                <div key={card.label} className="p-4 rounded-xl border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-white/50 text-xs mb-2">{card.label}</div>
                  <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-white/30 text-xs mt-1">{card.change}</div>
                </div>
              ))}

              {/* Skill radar placeholder */}
              <div className="p-4 rounded-xl border border-white/5 col-span-1 row-span-2"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-white/50 text-xs mb-3">Skill Radar</div>
                <svg viewBox="0 0 160 160" className="w-full" style={{ maxHeight: 160 }}>
                  <polygon points="80,20 140,60 120,130 40,130 20,60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <polygon points="80,40 120,65 105,115 55,115 40,65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <polygon points="80,60 100,70 90,100 70,100 60,70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <polygon points="80,25 128,58 108,122 52,122 32,58" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
                  {[80, 140, 120, 40, 20].map((x, i) => {
                    const ys = [25, 58, 122, 122, 58];
                    return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#6366f1" />;
                  })}
                  {['React', 'Node', 'CSS', 'AWS', 'TypeScript'].map((s, i) => {
                    const positions = [[80, 12], [148, 58], [128, 138], [32, 138], [12, 58]];
                    return <text key={s} x={positions[i][0]} y={positions[i][1]} fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle">{s}</text>;
                  })}
                </svg>
              </div>

              {/* AI Match */}
              <div className="p-4 rounded-xl border border-indigo-500/20 col-span-2"
                style={{ background: 'rgba(99,102,241,0.05)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-300 font-medium">AI Match Suggestion</span>
                </div>
                <div className="text-white/80 text-sm font-medium mb-2">"Implement payment gateway" needs Node.js + AWS</div>
                <div className="space-y-1.5">
                  {[{ name: 'Marcus J.', score: 94, color: '#10b981' }, { name: 'Sarah C.', score: 81, color: '#6366f1' }, { name: 'David K.', score: 72, color: '#f59e0b' }].map((c) => (
                    <div key={c.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: c.color }}>{c.name[0]}</div>
                      <span className="text-xs text-white/60 flex-1">{c.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 max-w-20">
                        <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: c.color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: c.color }}>{c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workload */}
              <div className="p-4 rounded-xl border border-white/5 col-span-2"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-white/50 text-xs mb-3">Team Workload</div>
                <div className="space-y-2">
                  {[{ n: 'Sarah C.', v: 72, c: '#6366f1' }, { n: 'Marcus J.', v: 93, c: '#ef4444' }, { n: 'Priya P.', v: 45, c: '#10b981' }].map((m) => (
                    <div key={m.n} className="flex items-center gap-2">
                      <span className="text-xs text-white/50 w-16 truncate">{m.n}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.v}%`, background: m.c }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right" style={{ color: m.c }}>{m.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4">Core Features</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Everything your workforce needs</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Six AI-powered pillars that transform how organizations understand and optimize their people.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${activeFeature === i ? 'border-white/20 scale-[1.02]' : 'border-white/5 hover:border-white/10'}`}
                style={{ background: activeFeature === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)' }}
                onClick={() => setActiveFeature(i)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color}`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{f.description}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-white/60">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {f.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Built for every role</h2>
            <p className="text-white/50 text-lg">Tailored dashboards and workflows for every persona in your organization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((r) => (
              <div key={r.label} className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3 ${r.color} ${r.bg}`}>
                  {r.label}
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to forge your workforce?</h2>
          <p className="text-white/50 text-lg mb-8">Join forward-thinking organizations using SkillForge to optimize their most valuable asset.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-base font-semibold px-10 h-12"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                Launch Demo Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-4">No setup required • Mock data included • Explore all features</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-white/30 text-sm">SkillForge © 2026</span>
          </div>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <Star className="w-3 h-3 text-amber-400" />
            <span>AI-Powered Workforce Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
