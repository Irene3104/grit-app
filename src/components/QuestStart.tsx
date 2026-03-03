import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  goal: string;
  onDone: () => void;
}

const LINES = [
  { text: '⚔️  새로운 퀘스트 발견', delay: 0 },
  { text: null, delay: 0.7 },          // goal 표시
  { text: '🔔  임무를 수락하시겠습니까?', delay: 1.4 },
];

export default function QuestStart({ goal, onDone }: Props) {
  const [phase, setPhase] = useState(0); // 0: 타이핑중 1: 버튼 대기
  const [tap, setTap] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    setTap(true);
    setTimeout(onDone, 700);
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 배경 스캔라인 효과 */}
      <div style={styles.scanlines} />

      <div style={styles.box}>
        {/* 상단 배지 */}
        <motion.div style={styles.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          ✦ QUEST BOARD ✦
        </motion.div>

        {/* 라인들 */}
        <div style={styles.lines}>
          {LINES.map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: line.delay + 0.3, duration: 0.4 }}
            >
              {line.text === null ? (
                <p style={styles.goalText}>"{goal}"</p>
              ) : (
                <p style={styles.lineText}>{line.text}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* 구분선 */}
        <motion.div style={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.0, duration: 0.4 }}
        />

        {/* 버튼 영역 */}
        <AnimatePresence>
          {phase === 1 && (
            <motion.div style={styles.btnRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                style={{ ...styles.acceptBtn, ...(tap ? styles.acceptBtnTap : {}) }}
                whileTap={{ scale: 0.95 }}
                onClick={accept}
              >
                ✅  수락
              </motion.button>
              <motion.button
                style={styles.declineBtn}
                whileTap={{ scale: 0.95 }}
                onClick={onDone}
              >
                ✖  거절
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 깜빡이는 커서 (타이핑 중) */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div style={styles.cursor}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            exit={{ opacity: 0 }}
          >▮</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
    pointerEvents: 'none',
  },
  box: {
    width: '100%',
    maxWidth: '380px',
    background: '#111118',
    border: '1.5px solid #a78bfa60',
    borderRadius: '12px',
    padding: '2rem 1.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    boxShadow: '0 0 40px #a78bfa20',
  },
  badge: {
    alignSelf: 'center',
    background: '#a78bfa18',
    border: '1px solid #a78bfa50',
    borderRadius: '999px',
    padding: '0.3rem 1rem',
    color: '#a78bfa',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  lineText: {
    color: '#ffffff80',
    fontSize: '0.95rem',
    margin: 0,
    fontFamily: 'monospace',
  },
  goalText: {
    color: '#ffffff',
    fontSize: '1.4rem',
    fontWeight: '700',
    margin: 0,
    lineHeight: 1.3,
  },
  divider: {
    height: '1px',
    background: '#ffffff15',
    transformOrigin: 'left',
  },
  btnRow: {
    display: 'flex',
    gap: '0.8rem',
  },
  acceptBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    padding: '0.9rem',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  acceptBtnTap: {
    background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
  },
  declineBtn: {
    flex: 1,
    background: 'transparent',
    border: '1.5px solid #ffffff20',
    borderRadius: '10px',
    padding: '0.9rem',
    color: '#ffffff50',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  cursor: {
    position: 'absolute',
    bottom: '2.5rem',
    right: '2.5rem',
    color: '#a78bfa',
    fontSize: '1.2rem',
  },
};
