import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  // Dark theme inline styles
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 0%, rgba(79,142,247,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.05) 0%, transparent 60%), #080C18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Mono', 'Fira Code', monospace",
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '48px 40px',
      width: '100%',
      maxWidth: 420,
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    logo: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' as const, letterSpacing: '-0.02em' },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' as const, marginTop: 8, marginBottom: 36 },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 10,
      color: '#FFFFFF',
      fontSize: 14,
      outline: 'none',
      marginBottom: 14,
      boxSizing: 'border-box' as const,
    },
    btn: {
      width: '100%',
      padding: '12px',
      background: '#4F8EF7',
      border: 'none',
      borderRadius: 10,
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 600,
      cursor: busy ? 'not-allowed' : 'pointer',
      opacity: busy ? 0.6 : 1,
    },
    link: {
      color: 'rgba(79,142,247,0.8)',
      cursor: 'pointer',
      fontSize: 13,
      textAlign: 'center' as const,
      marginTop: 20,
      border: 'none',
      background: 'none',
    },
    error: {
      color: '#F87171',
      fontSize: 13,
      textAlign: 'center' as const,
      marginBottom: 14,
      padding: '10px 16px',
      background: 'rgba(248,113,113,0.1)',
      borderRadius: 8,
      border: '1px solid rgba(248,113,113,0.2)',
    },
    separator: {
      height: 1,
      background: 'rgba(255,255,255,0.06)',
      margin: '24px 0',
    },
    demoBtn: {
      width: '100%',
      padding: '10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      color: 'rgba(255,255,255,0.6)',
      fontSize: 13,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src="/logo-colour.jpg" alt="CntxtLens" style={{width:'auto',height:56,marginBottom:16,borderRadius:12,objectFit:'contain'}}/>
        <div style={styles.sub}>FinOps Platform</div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {mode === 'register' && (
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button style={styles.btn} type="submit" disabled={busy}>
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={styles.separator} />

        <button style={styles.demoBtn} onClick={() => {
          // Set first run — auto-login if no users exist
          setEmail('admin@cntxtlens.local');
          setPassword('cntxtlens');
          setMode('login');
        }}>
          🔑 Demo: admin@cntxtlens.local / cntxtlens
        </button>

        <button style={styles.link} onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
        }}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
