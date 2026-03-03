import { useEffect } from 'react';
import { motion } from 'framer-motion';

// 칼 + 방패 SVG 로고
function SwordShieldLogo() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 14px #a78bfa70)' }}
    >
      {/* 방패 */}
      <path d="M18 16 L18 44 Q18 58 32 64 Q46 58 46 44 L46 16 Z"
        fill="#1e1b4b" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* 방패 내부 장식 — 마름모 */}
      <path d="M32 24 L38 34 L32 44 L26 34 Z"
        fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6"/>
      {/* 방패 중앙 보석 */}
      <circle cx="32" cy="34" r="4" fill="#a78bfa" opacity="0.9"/>
      <circle cx="32" cy="34" r="2" fill="#e0d7ff"/>
      {/* 방패 테두리 하이라이트 */}
      <path d="M21 18 L21 43 Q21 54 32 60"
        stroke="#c4b5fd" strokeWidth="1" opacity="0.4" strokeLinecap="round"/>

      {/* 칼 — 대각선 (오른쪽 위에서 왼쪽 아래로) */}
      {/* 칼날 */}
      <line x1="52" y1="12" x2="30" y2="58"
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      {/* 칼날 하이라이트 */}
      <line x1="54" y1="14" x2="32" y2="56"
        stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      {/* 가드 (크로스가드) */}
      <line x1="58" y1="28" x2="44" y2="22"
        stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
      {/* 손잡이 */}
      <line x1="62" y1="18" x2="56" y2="30"
        stroke="#92400e" strokeWidth="5" strokeLinecap="round"/>
      {/* 손잡이 래핑 */}
      <line x1="61" y1="20" x2="59" y2="24"
        stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="59" y1="24" x2="57" y2="28"
        stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      {/* 칼끝 빛남 */}
      <circle cx="30" cy="58" r="2.5" fill="#fef3c7" opacity="0.8"/>
    </svg>
  );
}

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div style={styles.container}>
      {/* 배경 파티클 — 바위 조각 느낌 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...styles.particle,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${6 + (i % 3) * 4}px`,
            height: `${6 + (i % 3) * 4}px`,
            borderRadius: '2px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0.4, 0], y: [20, -30, -60] }}
          transition={{ delay: 0.3 + i * 0.15, duration: 2.2, ease: 'easeOut' }}
        />
      ))}

      {/* 메인 로고 */}
      <motion.div style={styles.logoWrap}
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Questify 로고 이미지 */}
        <motion.div style={styles.iconWrap}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/questify-logo.png"
            alt="Questify"
            style={{ width: '180px', height: '180px', objectFit: 'contain' }}
          />
        </motion.div>

        {/* 서브 태그라인 */}
        <motion.p style={styles.tagline}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          퀘스트를 완수하고 성장하라.
        </motion.p>
      </motion.div>

      {/* 하단 로딩 바 */}
      <motion.div style={styles.loaderTrack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <motion.div style={styles.loaderBar}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.1, duration: 1.4, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    position: 'relative',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    background: '#ffffff18',
    transform: 'rotate(30deg)',
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  iconWrap: {
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '3.2rem',
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: '0.04em',
    fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    lineHeight: 1,
  },
  tagline: {
    color: '#ffffff50',
    fontSize: '0.85rem',
    letterSpacing: '0.02em',
    margin: 0,
    marginTop: '0.3rem',
  },
  loaderTrack: {
    position: 'absolute',
    bottom: '3.5rem',
    width: '120px',
    height: '2px',
    background: '#ffffff15',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #a78bfa, #f97316)',
    borderRadius: '99px',
  },
};
