'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roles = ['Employee', 'Manager', 'Admin', 'Executive'];
const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'Employee', department: 'Engineering' });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/overview');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'oklch(0.08 0.03 264)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SkillForge</span>
        </div>

        <div className="p-8 rounded-3xl border border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          {/* Steps */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s <= step ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs ${s <= step ? 'text-white/70' : 'text-white/30'}`}>
                  {s === 1 ? 'Your Info' : 'Work Details'}
                </span>
                {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-indigo-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/50 text-sm mb-6">Join SkillForge — free forever for your team</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/70 text-sm mb-1.5 block">First Name</Label>
                    <Input value={form.firstName} onChange={e => update('firstName', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      placeholder="Sarah" required />
                  </div>
                  <div>
                    <Label className="text-white/70 text-sm mb-1.5 block">Last Name</Label>
                    <Input value={form.lastName} onChange={e => update('lastName', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      placeholder="Chen" required />
                  </div>
                </div>

                <div>
                  <Label className="text-white/70 text-sm mb-1.5 block">Work Email</Label>
                  <Input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    placeholder="you@company.com" required />
                </div>

                <div>
                  <Label className="text-white/70 text-sm mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                      placeholder="Min. 8 characters" required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Your Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button key={r} type="button" onClick={() => update('role', r)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.role === r ? 'border-indigo-500/50 text-indigo-300 bg-indigo-500/10' : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'}`}
                        style={form.role !== r ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Department</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.slice(0, 6).map((d) => (
                      <button key={d} type="button" onClick={() => update('department', d)}
                        className={`p-2.5 rounded-xl border text-sm transition-all ${form.department === d ? 'border-indigo-500/50 text-indigo-300 bg-indigo-500/10' : 'border-white/10 text-white/50 hover:border-white/20'}`}
                        style={form.department !== d ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-2"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
              ) : step < 2 ? (
                <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
