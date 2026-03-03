import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
        {/* 아이콘 — 등반 픽토그램 */}
        <motion.div style={styles.iconWrap}
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            {/* 암벽 */}
            <polygon points="8,58 56,58 44,10 20,10" fill="#3a3a5a" opacity="0.9"/>
            <polygon points="8,58 56,58 52,30 12,30" fill="#4a4a7a" opacity="0.8"/>
            {/* 홀드 */}
            <circle cx="28" cy="22" r="3" fill="#a78bfa"/>
            <circle cx="40" cy="38" r="3" fill="#a78bfa"/>
            <circle cx="22" cy="44" r="3" fill="#a78bfa"/>
            {/* 캐릭터 (고양이 실루엣) */}
            <circle cx="32" cy="18" r="5" fill="#f97316"/>
            {/* 귀 */}
            <polygon points="28,14 30,10 32,14" fill="#f97316"/>
            <polygon points="32,14 34,10 36,14" fill="#f97316"/>
            {/* 몸 */}
            <rect x="28" y="22" width="8" height="10" rx="2" fill="#f97316"/>
            {/* 팔 — 홀드 잡는 모션 */}
            <line x1="28" y1="25" x2="22" y2="22" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
            <line x1="36" y1="25" x2="40" y2="22" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
            {/* 헬멧 */}
            <path d="M27,17 Q32,12 37,17" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </motion.div>

        {/* GRIT 타이포 */}
        <motion.div style={styles.title}
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.08em' }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        >
          GRIT
        </motion.div>

        {/* 서브 태그라인 */}
        <motion.p style={styles.tagline}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          시간 안에 완료하라. 실패하면 추락한다.
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
    fontSize: '4rem',
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: '0.08em',
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
