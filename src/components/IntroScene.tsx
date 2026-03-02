import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../types';
import ClimbingCat from './ClimbingCat';

interface Props {
  character: Character;
  goal: string;
  onDone: () => void;
}

export default function IntroScene({ character: _character, goal, onDone }: Props) {
  const [phase, setPhase] = useState(0);
  // phase 0: 산 아래 바라보기
  // phase 1: "등벽을 시작합니다" 텍스트
  // phase 2: 메인으로 전환

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2500);
    const t2 = setTimeout(() => setPhase(2), 4500);
    const t3 = setTimeout(() => onDone(), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* 산 배경 */}
      <div style={styles.mountain}>
        {/* 절벽 실루엣 */}
        <div style={styles.cliff} />
        {/* 정상 빛 */}
        <motion.div
          style={styles.summit}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      {/* 캐릭터 — 산 아래에서 정상 바라보기 */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            style={styles.characterWrap}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ClimbingCat state="idle" size={90} />
            </motion.div>
            <p style={styles.goalText}>"{goal}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "등벽을 시작합니다" 텍스트 */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            style={styles.textWrap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <p style={styles.introText}>등벽을 시작합니다.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0a0a1a, #1a1a3a, #2a1a0a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mountain: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cliff: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '70vh',
    background: 'linear-gradient(to bottom, #3a3a4a, #1a1a2a)',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 0 60px #00000080',
  },
  summit: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, #ffffff20, transparent)',
    borderRadius: '50%',
  },
  characterWrap: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '30vh',
  },
  charEmoji: {
    fontSize: '4rem',
  },
  goalText: {
    color: '#ffffff80',
    fontSize: '1rem',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '300px',
  },
  textWrap: {
    position: 'relative',
    zIndex: 10,
  },
  introText: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.03em',
    textAlign: 'center',
  },
};
