import React, { useState } from 'react';
import { useFitnessStore } from '../stores/fitnessStore';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06070d', fontFamily: "'Inter', system-ui, sans-serif" } as React.CSSProperties,
  card: { width: '100%', maxWidth: 420, padding: '48px 40px', borderRadius: 28, background: '#111320', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' } as React.CSSProperties,
  logo: { width: 52, height: 52, borderRadius: 16, margin: '0 auto 20px', background: 'rgba(124,110,247,0.14)', display: 'grid', placeItems: 'center' } as React.CSSProperties,
  h1: { fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', margin: 0, color: '#f1f5f9', textAlign: 'center' as const },
  sub: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginTop: 8, textAlign: 'center' as const },
  form: { display: 'flex', flexDirection: 'column' as const, gap: 20, marginTop: 36 },
  label: { fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', color: '#f1f5f9', fontSize: '0.92rem', fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'border-color 0.2s' } as React.CSSProperties,
  btn: { width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: '#7c6ef7', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', marginTop: 8, transition: 'all 0.2s' } as React.CSSProperties,
  toggle: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.74rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em', marginTop: 28, textAlign: 'center' as const, display: 'block', width: '100%', transition: 'color 0.2s' } as React.CSSProperties,
};

const Auth: React.FC = () => {
  const { login } = useFitnessStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) { setError('Please fill all fields'); return; }
    if (pass.length < 4) { setError('Password must be at least 4 characters'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(mode === 'signup' ? name : email.split('@')[0], email);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c6ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h1 style={s.h1}>FITSENSE AI</h1>
        <p style={s.sub}>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</p>

        <form onSubmit={handleSubmit} style={s.form}>
          {mode === 'signup' && (
            <div>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
                onFocus={(e) => e.currentTarget.style.borderColor = '#7c6ef7'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'} />
            </div>
          )}
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
              onFocus={(e) => e.currentTarget.style.borderColor = '#7c6ef7'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'} />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required
              onFocus={(e) => e.currentTarget.style.borderColor = '#7c6ef7'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'} />
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0, textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#6d5ce8'; }}
            onMouseLeave={(e) => e.currentTarget.style.background = '#7c6ef7'}>
            {loading ? 'Signing in...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button style={s.toggle} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7c6ef7'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
          {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
