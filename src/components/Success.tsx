import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../types';

interface Props {
  goal: string;
  character: Character;
}

const CHAR_EMOJI: Record<Character, string> = {
  tiger: '🐯',
  capybara: '🦦',
  kangaroo: '🦘',
  koala: '🐨',
};

// confetti 파티클
const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
  size: 6 + Math.random() * 8,
}));

export default function Success({ goal, character }: Props) {
  const [phase, setPhase] = useState(0);
  // 0: 올라오는 씬, 1: 뒤돌아보기, 2: 배지 + 목표, 3: 칭찬 멘트

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Confetti */}
      {phase >= 2 &&
        CONFETTI.map((c) => (
          <motion.div
            key={c.id}
            style={{
              ...styles.confettiPiece,
              left: `${c.x}%`,
              width: c.size,
              height: c.size,
              background: c.color,
            }}
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: '110vh', opacity: 0, rotate: 360 }}
            transition={{ duration: 3 + Math.random() * 2, delay: c.delay }}
          />
        ))}

      {/* 캐릭터 올라오는 씬 */}
      <motion.div
        style={styles.charWrap}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* 절벽 끝 */}
        <div style={styles.cliffTop} />

        {/* 캐릭터 */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.span
              key="climbing"
              style={styles.charEmoji}
              exit={{ opacity: 0 }}
            >
              {CHAR_EMOJI[character]}
            </motion.span>
          )}
          {phase >= 1 && (
            <motion.div
              key="celebrating"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={styles.celebChar}
            >
              <motion.span
                style={styles.charEmoji}
                animate={{ y: [0, -12, 0], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {CHAR_EMOJI[character]}
              </motion.span>
              {phase >= 1 && (
                <motion.span
                  style={styles.hurreyText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  🎉
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 완주 배지 */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={styles.badge}
          >
            <span style={{ fontSize: '2rem' }}>🏅</span>
            <span style={styles.badgeText}>완주</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 목표 텍스트 */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.goalBox}
          >
            <p style={styles.goalQuote}>"{goal}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 칭찬 멘트 */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.praiseBlock}
          >
            <p style={styles.praiseText}>
              오늘도 성공적인 인생에
            </p>
            <p style={styles.praiseText}>
              한 발자국 가까워졌습니다. ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0a1a0a, #1a2a0a, #2a3a1a)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem',
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
    borderRadius: '2px',
    pointerEvents: 'none',
  },
  charWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  cliffTop: {
    width: '80px',
    height: '12px',
    background: '#4a4a5a',
    borderRadius: '4px 4px 0 0',
    marginBottom: '-4px',
  },
  celebChar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
  },
  charEmoji: {
    fontSize: '3.5rem',
    display: 'block',
  },
  hurreyText: {
    fontSize: '1.8rem',
    display: 'block',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#ffffff10',
    border: '1.5px solid #FFD70060',
    borderRadius: '16px',
    padding: '1rem 2rem',
  },
  badgeText: {
    color: '#FFD700',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
  },
  goalBox: {
    textAlign: 'center',
    maxWidth: '320px',
  },
  goalQuote: {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  praiseBlock: {
    textAlign: 'center',
  },
  praiseText: {
    color: '#ffffff80',
    fontSize: '1rem',
    lineHeight: 1.8,
  },
};
