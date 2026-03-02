import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  todoText: string;
  onClose: () => void;
  onComplete?: () => void; // 타이머 완료 시 자동 체크
}

const PRESETS = [
  { label: '5분', min: 5 },
  { label: '15분', min: 15 },
  { label: '20분', min: 20 },
  { label: '30분', min: 30 },
  { label: '1시간', min: 60 },
];

export default function PomodoroModal({ todoText, onClose, onComplete }: Props) {
  const [customMin, setCustomMin] = useState('25');
  const [customSec, setCustomSec] = useState('00');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(25);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalMinNum = selectedPreset ?? (parseInt(customMin) || 0);
  const totalSecNum = selectedPreset !== null ? 0 : (parseInt(customSec) || 0);
  const totalSeconds = totalMinNum * 60 + totalSecNum;

  const progress = secondsLeft !== null && totalSeconds > 0
    ? (totalSeconds - secondsLeft) / totalSeconds
    : 0;

  useEffect(() => {
    if (running && secondsLeft !== null && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => (s !== null ? s - 1 : s));
      }, 1000);
    } else if (secondsLeft === 0) {
      setRunning(false);
      // 알람음
      try {
        const ctx = new AudioContext();
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = i % 2 === 0 ? 880 : 660;
          const startT = ctx.currentTime + i * 0.4;
          gain.gain.setValueAtTime(0.3, startT);
          gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);
          osc.start(startT);
          osc.stop(startT + 0.35);
        }
      } catch {}
      // 즉시 완료 콜백 (모달 닫히기 전에)
      onComplete?.();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, secondsLeft]);

  const handlePreset = (min: number) => {
    setSelectedPreset(min);
    setCustomMin(String(min));
    setCustomSec('00');
  };

  const handleCustomChange = (type: 'min' | 'sec', val: string) => {
    setSelectedPreset(null);
    if (type === 'min') setCustomMin(val);
    else setCustomSec(val);
  };

  const start = () => {
    setSecondsLeft(totalSeconds);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = () => { setRunning(false); setSecondsLeft(null); };

  const displayMin = secondsLeft !== null ? Math.floor(secondsLeft / 60) : totalMinNum;
  const displaySec = secondsLeft !== null ? secondsLeft % 60 : totalSecNum;
  const isDone = secondsLeft === 0;

  // 완료 후 2초 뒤 자동 닫기
  useEffect(() => {
    if (isDone) {
      const t = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(t);
    }
  }, [isDone, onClose]);

  const r = 60;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div style={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div style={styles.modal} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <p style={styles.todoLabel}>"{todoText}"</p>
        <p style={styles.subLabel}>집중 타이머</p>

        {/* 원형 타이머 */}
        <div style={styles.circleWrap}>
          <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r={r} fill="none" stroke="#ffffff15" strokeWidth="8" />
            <motion.circle cx="80" cy="80" r={r} fill="none"
              stroke={isDone ? '#4ade80' : '#ffffff'} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div style={styles.timerText}>
            {isDone
              ? <span style={{ fontSize: '1.5rem' }}>🎉</span>
              : <span style={styles.timerNum}>
                  {String(displayMin).padStart(2, '0')}:{String(displaySec).padStart(2, '0')}
                </span>
            }
          </div>
        </div>

        {isDone && <p style={styles.doneText}>완료! 잘 했어요 🔥</p>}

        {/* 설정 UI (타이머 안 돌아갈 때만) */}
        {secondsLeft === null && (
          <>
            {/* 프리셋 버튼 */}
            <div style={styles.presets}>
              {PRESETS.map((p) => (
                <button key={p.min}
                  style={{ ...styles.presetBtn, ...(selectedPreset === p.min ? styles.presetBtnActive : {}) }}
                  onClick={() => handlePreset(p.min)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 직접 입력 */}
            <div style={styles.customRow}>
              <span style={styles.customLabel}>직접 입력</span>
              <div style={styles.customInputRow}>
                <input style={styles.customInput} type="number" min={0} max={99}
                  value={customMin}
                  onChange={(e) => handleCustomChange('min', e.target.value)}
                  placeholder="25"
                />
                <span style={styles.customSep}>분</span>
                <input style={styles.customInput} type="number" min={0} max={59}
                  value={customSec}
                  onChange={(e) => handleCustomChange('sec', e.target.value)}
                  placeholder="00"
                />
                <span style={styles.customSep}>초</span>
              </div>
            </div>
          </>
        )}

        {/* 컨트롤 버튼 */}
        <div style={styles.controls}>
          {secondsLeft === null && (
            <button style={{ ...styles.startBtn, opacity: totalSeconds > 0 ? 1 : 0.3 }}
              onClick={() => totalSeconds > 0 && start()}
            >시작</button>
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
          {isDone && <p style={styles.doneText}>할 일이 완료됩니다! ✅</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: '#000000bb',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#1a1a2a', borderRadius: '24px', padding: '2rem',
    width: '340px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1rem', position: 'relative', border: '1px solid #ffffff15',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'none', border: 'none', color: '#ffffff60', fontSize: '1rem', cursor: 'pointer',
  },
  todoLabel: { color: '#ffffff', fontSize: '0.95rem', textAlign: 'center', fontStyle: 'italic' },
  subLabel: { color: '#ffffff40', fontSize: '0.8rem' },
  circleWrap: { position: 'relative', width: '160px', height: '160px' },
  timerText: {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  timerNum: { fontSize: '2rem', fontWeight: '700', color: '#ffffff', fontVariantNumeric: 'tabular-nums' },
  doneText: { color: '#4ade80', fontSize: '1rem', fontWeight: '600' },
  presets: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  presetBtn: {
    background: 'none', border: '1px solid #ffffff20', color: '#ffffff60',
    borderRadius: '8px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  presetBtnActive: { background: '#ffffff', color: '#000', border: '1px solid #ffffff' },
  customRow: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '100%' },
  customLabel: { color: '#ffffff40', fontSize: '0.75rem' },
  customInputRow: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  customInput: {
    width: '54px', background: '#ffffff0d', border: '1px solid #ffffff20',
    borderRadius: '8px', color: '#ffffff', fontSize: '1.1rem', fontWeight: '600',
    padding: '0.4rem 0', textAlign: 'center', outline: 'none',
  },
  customSep: { color: '#ffffff60', fontSize: '0.85rem' },
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
