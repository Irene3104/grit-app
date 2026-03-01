import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  todoText: string;
  onClose: () => void;
}

const PRESETS = [15, 20, 25, 30, 45];

export default function PomodoroModal({ todoText, onClose }: Props) {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = minutes * 60;
  const progress = secondsLeft !== null ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  useEffect(() => {
    if (running && secondsLeft !== null && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => (s !== null ? s - 1 : s));
      }, 1000);
    } else if (secondsLeft === 0) {
      setRunning(false);
      // 알람
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch {}
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, secondsLeft]);

  const start = () => {
    setSecondsLeft(minutes * 60);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = () => {
    setRunning(false);
    setSecondsLeft(null);
  };

  const displayMin = secondsLeft !== null ? Math.floor(secondsLeft / 60) : minutes;
  const displaySec = secondsLeft !== null ? secondsLeft % 60 : 0;
  const isDone = secondsLeft === 0;

  // 원형 진행 바
  const r = 60;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      style={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        style={styles.modal}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
      >
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <p style={styles.todoLabel}>"{todoText}"</p>
        <p style={styles.subLabel}>집중 타이머</p>

        {/* 원형 타이머 */}
        <div style={styles.circleWrap}>
          <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r={r} fill="none" stroke="#ffffff15" strokeWidth="8" />
            <motion.circle
              cx="80" cy="80" r={r} fill="none"
              stroke={isDone ? '#4ade80' : '#ffffff'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div style={styles.timerText}>
            {isDone ? (
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
            ) : (
              <span style={styles.timerNum}>
                {String(displayMin).padStart(2, '0')}:{String(displaySec).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {isDone && <p style={styles.doneText}>완료! 잘 했어요 🔥</p>}

        {/* 프리셋 */}
        {secondsLeft === null && (
          <div style={styles.presets}>
            {PRESETS.map((m) => (
              <button key={m}
                style={{ ...styles.presetBtn, ...(minutes === m ? styles.presetBtnActive : {}) }}
                onClick={() => setMinutes(m)}
              >
                {m}분
              </button>
            ))}
          </div>
        )}

        {/* 컨트롤 */}
        <div style={styles.controls}>
          {secondsLeft === null && (
            <button style={styles.startBtn} onClick={start}>시작</button>
          )}
          {secondsLeft !== null && !isDone && (
            <>
              {running
                ? <button style={styles.pauseBtn} onClick={pause}>일시정지</button>
                : <button style={styles.startBtn} onClick={resume}>재개</button>
              }
              <button style={styles.resetBtn} onClick={reset}>초기화</button>
            </>
          )}
          {isDone && (
            <button style={styles.startBtn} onClick={reset}>다시 시작</button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: '#000000aa',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#1a1a2a', borderRadius: '24px', padding: '2rem',
    width: '340px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1rem', position: 'relative',
    border: '1px solid #ffffff15',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem', background: 'none',
    border: 'none', color: '#ffffff60', fontSize: '1rem', cursor: 'pointer',
  },
  todoLabel: { color: '#ffffff', fontSize: '0.95rem', textAlign: 'center', fontStyle: 'italic' },
  subLabel: { color: '#ffffff40', fontSize: '0.8rem' },
  circleWrap: { position: 'relative', width: '160px', height: '160px' },
  timerText: {
    position: 'absolute', inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  timerNum: { fontSize: '2rem', fontWeight: '700', color: '#ffffff', fontVariantNumeric: 'tabular-nums' },
  doneText: { color: '#4ade80', fontSize: '1rem', fontWeight: '600' },
  presets: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  presetBtn: {
    background: 'none', border: '1px solid #ffffff20', color: '#ffffff60',
    borderRadius: '8px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  presetBtnActive: { background: '#ffffff', color: '#000', border: '1px solid #ffffff' },
  controls: { display: 'flex', gap: '0.8rem' },
  startBtn: {
    background: '#ffffff', color: '#000', border: 'none', borderRadius: '999px',
    padding: '0.6rem 1.8rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
  },
  pauseBtn: {
    background: '#ffffff20', color: '#fff', border: '1px solid #ffffff30', borderRadius: '999px',
    padding: '0.6rem 1.5rem', fontSize: '0.95rem', cursor: 'pointer',
  },
  resetBtn: {
    background: 'none', color: '#ffffff40', border: '1px solid #ffffff20', borderRadius: '999px',
    padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer',
  },
};
