import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AuthUser } from '../types';

interface Props {
  onLogin: (user: AuthUser) => void;
}

type Mode = 'main' | 'email-login' | 'email-signup';

// 임시 mock 인증 (백엔드 연동 전)
function mockAuth(email: string, _password: string, name?: string): AuthUser {
  return {
    id: btoa(email),
    email,
    displayName: name || email.split('@')[0],
    provider: 'email',
  };
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // TODO: Firebase Google Auth 연동
    setTimeout(() => {
      onLogin({
        id: 'google-mock-id',
        email: 'user@gmail.com',
        displayName: 'Google User',
        provider: 'google',
      });
      setLoading(false);
    }, 800);
  };

  const handleEmailLogin = () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('올바른 이메일 형식이 아니에요.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요.'); return; }
    setError('');
    setLoading(true);
    // TODO: 실제 로그인 API 연동
    setTimeout(() => {
      onLogin(mockAuth(email, password));
      setLoading(false);
    }, 600);
  };

  const handleEmailSignup = () => {
    if (!name.trim()) { setError('닉네임을 입력해주세요.'); return; }
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('올바른 이메일 형식이 아니에요.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요.'); return; }
    setError('');
    setLoading(true);
    // TODO: 실제 회원가입 API 연동
    setTimeout(() => {
      onLogin(mockAuth(email, password, name));
      setLoading(false);
    }, 800);
  };

  return (
    <motion.div style={styles.page}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* 배경 파티클 */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div style={styles.inner}>
        {/* 로고 */}
        <motion.div style={styles.logoWrap}
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <img src="/questify-logo.png" alt="Questify" style={styles.logoImg} />
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── 메인 선택 화면 ── */}
          {mode === 'main' && (
            <motion.div key="main" style={styles.card}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
            >
              <div style={styles.cardHeader}>
                <p style={styles.cardBadge}>✦ QUESTIFY ✦</p>
                <h2 style={styles.cardTitle}>시작하기</h2>
                <p style={styles.cardSub}>퀘스트를 완수하고 성장하라</p>
              </div>

              {/* Google 로그인 */}
              <motion.button style={styles.googleBtn}
                whileTap={{ scale: 0.97 }} onClick={handleGoogleLogin}
                disabled={loading}
              >
                <GoogleIcon />
                <span>Google로 계속하기</span>
              </motion.button>

              {/* 구분선 */}
              <div style={styles.dividerRow}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>또는</span>
                <div style={styles.dividerLine} />
              </div>

              {/* 이메일 로그인/가입 */}
              <motion.button style={styles.emailBtn}
                whileTap={{ scale: 0.97 }} onClick={() => setMode('email-login')}
              >
                📧 이메일로 로그인
              </motion.button>
              <motion.button style={styles.signupBtn}
                whileTap={{ scale: 0.97 }} onClick={() => setMode('email-signup')}
              >
                ✨ 새 계정 만들기
              </motion.button>

              <p style={styles.terms}>
                계속하면 <span style={styles.link}>이용약관</span> 및{' '}
                <span style={styles.link}>개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
              </p>
            </motion.div>
          )}

          {/* ── 이메일 로그인 ── */}
          {mode === 'email-login' && (
            <motion.div key="email-login" style={styles.card}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            >
              <button style={styles.backBtn} onClick={() => { setMode('main'); setError(''); }}>
                ← 뒤로
              </button>
              <h2 style={styles.cardTitle}>로그인</h2>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>이메일</label>
                <input style={styles.input} type="email" placeholder="name@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                  autoFocus
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>비밀번호</label>
                <input style={styles.input} type="password" placeholder="6자 이상"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                />
              </div>

              {error && <p style={styles.error}>⚠️ {error}</p>}

              <motion.button style={{ ...styles.primaryBtn, ...(loading ? styles.btnDisabled : {}) }}
                whileTap={{ scale: 0.97 }} onClick={handleEmailLogin} disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인 →'}
              </motion.button>

              <button style={styles.switchBtn} onClick={() => { setMode('email-signup'); setError(''); }}>
                계정이 없으신가요? <span style={styles.link}>회원가입</span>
              </button>
            </motion.div>
          )}

          {/* ── 이메일 회원가입 ── */}
          {mode === 'email-signup' && (
            <motion.div key="email-signup" style={styles.card}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            >
              <button style={styles.backBtn} onClick={() => { setMode('main'); setError(''); }}>
                ← 뒤로
              </button>
              <h2 style={styles.cardTitle}>회원가입</h2>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>닉네임</label>
                <input style={styles.input} type="text" placeholder="모험가 이름을 지어주세요"
                  value={name} onChange={e => { setName(e.target.value); setError(''); }}
                  autoFocus
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>이메일</label>
                <input style={styles.input} type="email" placeholder="name@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>비밀번호</label>
                <input style={styles.input} type="password" placeholder="6자 이상"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleEmailSignup()}
                />
              </div>

              {error && <p style={styles.error}>⚠️ {error}</p>}

              <motion.button style={{ ...styles.primaryBtn, ...(loading ? styles.btnDisabled : {}) }}
                whileTap={{ scale: 0.97 }} onClick={handleEmailSignup} disabled={loading}
              >
                {loading ? '가입 중...' : '모험 시작하기 →'}
              </motion.button>

              <button style={styles.switchBtn} onClick={() => { setMode('email-login'); setError(''); }}>
                이미 계정이 있으신가요? <span style={styles.link}>로그인</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', background: '#0d0d14',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '1.5rem',
  },
  bgGlow1: {
    position: 'absolute', top: '-10%', left: '-10%',
    width: '50vw', height: '50vw', borderRadius: '50%',
    background: 'radial-gradient(circle, #a78bfa18 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute', bottom: '-10%', right: '-10%',
    width: '50vw', height: '50vw', borderRadius: '50%',
    background: 'radial-gradient(circle, #fbbf2412 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  inner: {
    width: '100%', maxWidth: '400px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
    zIndex: 1,
  },
  logoWrap: { display: 'flex', justifyContent: 'center' },
  logoImg: { width: '140px', height: '140px', objectFit: 'contain' },

  // 카드
  card: {
    width: '100%', background: '#13131e',
    border: '1px solid #ffffff12', borderRadius: '20px',
    padding: '1.8rem 1.6rem',
    display: 'flex', flexDirection: 'column', gap: '0.9rem',
    position: 'relative',
  },
  cardHeader: { textAlign: 'center', marginBottom: '0.3rem' },
  cardBadge: {
    color: '#a78bfa', fontSize: '0.65rem', fontWeight: '700',
    letterSpacing: '0.12em', margin: '0 0 0.5rem',
  },
  cardTitle: { color: '#ffffff', fontSize: '1.5rem', fontWeight: '800', margin: 0 },
  cardSub: { color: '#ffffff50', fontSize: '0.82rem', margin: '0.3rem 0 0' },

  // 뒤로 버튼
  backBtn: {
    background: 'none', border: 'none', color: '#ffffff50',
    fontSize: '0.9rem', cursor: 'pointer', padding: 0, textAlign: 'left',
    marginBottom: '0.2rem',
  },

  // Google 버튼
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
    background: '#ffffff', color: '#1a1a1a',
    border: 'none', borderRadius: '12px',
    padding: '0.85rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
    width: '100%',
  },

  // 구분선
  dividerRow: { display: 'flex', alignItems: 'center', gap: '0.7rem' },
  dividerLine: { flex: 1, height: '1px', background: '#ffffff15' },
  dividerText: { color: '#ffffff30', fontSize: '0.75rem' },

  // 이메일 버튼
  emailBtn: {
    background: '#1e1e2e', border: '1px solid #a78bfa40',
    borderRadius: '12px', padding: '0.85rem',
    color: '#ffffff', fontSize: '0.95rem', fontWeight: '600',
    cursor: 'pointer', width: '100%',
  },
  signupBtn: {
    background: 'transparent', border: '1px solid #ffffff15',
    borderRadius: '12px', padding: '0.85rem',
    color: '#ffffff80', fontSize: '0.95rem',
    cursor: 'pointer', width: '100%',
  },

  // 약관
  terms: { color: '#ffffff30', fontSize: '0.68rem', textAlign: 'center', lineHeight: 1.6, margin: '0.2rem 0 0' },
  link: { color: '#a78bfa', cursor: 'pointer' },

  // 입력 필드
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: '#ffffff60', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' },
  input: {
    background: '#0d0d14', border: '1px solid #ffffff18',
    borderRadius: '10px', padding: '0.75rem 0.9rem',
    color: '#ffffff', fontSize: '0.95rem', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },

  // 에러
  error: { color: '#f87171', fontSize: '0.8rem', margin: 0, background: '#f8717115', borderRadius: '8px', padding: '0.5rem 0.7rem' },

  // 주요 버튼
  primaryBtn: {
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    border: 'none', borderRadius: '12px',
    padding: '0.9rem', color: '#ffffff',
    fontSize: '1rem', fontWeight: '700',
    cursor: 'pointer', width: '100%',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },

  // 전환 버튼
  switchBtn: {
    background: 'none', border: 'none', color: '#ffffff50',
    fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', padding: '0.2rem',
  },
};
