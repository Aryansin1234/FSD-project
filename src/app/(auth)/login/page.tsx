'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const demoAccounts = [
  { label: 'Employee', email: 'sarah.chen@skillforge.io', role: 'Senior Engineer', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Manager', email: 'alex.rivera@skillforge.io', role: 'Tech Lead', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.chen@skillforge.io');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/overview');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.08 0.03 264)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 relative overflow-hidden justify-between">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SkillForge</span>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-5xl font-bold text-white leading-tight mb-4">
              Your team,<br />
              <span className="gradient-text">intelligently</span><br />
              optimized.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              AI-powered workforce intelligence that puts the right person on the right task at the right time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['AI Task Matching', 'Burnout Detection', 'Skill Gap Analysis', 'Career Intelligence'].map(f => (
              <div key={f} className="px-3 py-1.5 rounded-full text-sm text-white/60 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/30 text-sm">
          © 2026 SkillForge · AI-Powered Workforce Intelligence
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillForge</span>
          </div>

          <div className="p-8 rounded-3xl border border-white/10"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-white/50 text-sm mb-6">Sign in to your workforce dashboard</p>

            {/* Demo accounts */}
            <div className="mb-6">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Quick demo access</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button key={acc.label} onClick={() => setEmail(acc.email)}
                    className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] ${email === acc.email ? acc.bg + ' border-opacity-100' : 'border-white/10 hover:border-white/20'}`}
                    style={email !== acc.email ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                    <div className={`text-xs font-semibold ${acc.color}`}>{acc.label}</div>
                    <div className="text-white/40 text-[10px]">{acc.role}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-white/70 text-sm mb-1.5 block">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <Label className="text-white/70 text-sm mb-1.5 block">Password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/20 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold"
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-white/40">
              No account?{' '}
              <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
