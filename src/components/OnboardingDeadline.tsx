import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: (hour: string, period: 'AM' | 'PM') => void;
  onBack: () => void;
}

export default function OnboardingDeadline({ onNext, onBack }: Props) {
  const [hour, setHour] = useState(11);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');

  const displayHour = String(hour).padStart(2, '0');
  const displayMin = String(minute).padStart(2, '0');
  const timeStr = `${displayHour}:${displayMin}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <button style={styles.backBtn} onClick={onBack}>← 뒤로</button>
      <p style={styles.label}>오늘 할 일의 마감 시간을 정해주세요.</p>

      <div style={styles.timeBlock}>
        {/* 시 선택 */}
        <div style={styles.scrollCol}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <button key={h}
              style={{ ...styles.timeBtn, ...(hour === h ? styles.timeBtnActive : {}) }}
              onClick={() => setHour(h)}
            >
              {String(h).padStart(2, '0')}
            </button>
          ))}
        </div>

        <span style={styles.colon}>:</span>

        {/* 분 선택 */}
        <div style={styles.scrollCol}>
          {[0, 15, 30, 45].map((m) => (
            <button key={m}
              style={{ ...styles.timeBtn, ...(minute === m ? styles.timeBtnActive : {}) }}
              onClick={() => setMinute(m)}
            >
              {String(m).padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* AM/PM */}
        <div style={styles.periodCol}>
          {(['AM', 'PM'] as const).map((p) => (
            <button key={p}
              style={{ ...styles.periodBtn, ...(period === p ? styles.periodBtnActive : {}) }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 시간 미리보기 */}
      <div style={styles.preview}>
        <span style={styles.previewTime}>{timeStr} {period}</span>
      </div>

      <motion.button style={styles.button} onClick={() => onNext(timeStr, period)} whileTap={{ scale: 0.97 }}>
        다음 →
      </motion.button>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh', padding: '2rem', gap: '1.5rem', position: 'relative',
  },
  backBtn: {
    position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none',
    color: '#ffffff60', fontSize: '1rem', cursor: 'pointer',
  },
  label: { fontSize: '1.6rem', fontWeight: '600', color: '#ffffff', textAlign: 'center' },
  timeBlock: {
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
    background: '#ffffff0d', borderRadius: '16px', padding: '1rem',
  },
  scrollCol: {
    display: 'flex', flexDirection: 'column', gap: '0.4rem',
    maxHeight: '220px', overflowY: 'auto',
  },
  timeBtn: {
    background: 'none', border: '1px solid #ffffff20', color: '#ffffff80',
    borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer',
    fontSize: '1.1rem', fontWeight: '500', minWidth: '54px', transition: 'all 0.15s',
  },
  timeBtnActive: { background: '#ffffff', color: '#000000', border: '1px solid #ffffff' },
  colon: { color: '#ffffff', fontSize: '1.5rem', paddingTop: '0.4rem' },
  periodCol: { display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center', height: '100%' },
  periodBtn: {
    background: 'none', border: '1px solid #ffffff20', color: '#ffffff60',
    borderRadius: '8px', padding: '0.4rem 0.7rem', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.15s',
  },
  periodBtnActive: { background: '#ffffff', color: '#000000' },
  preview: { textAlign: 'center' },
  previewTime: { fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' },
  button: {
    background: '#ffffff', color: '#000000', border: 'none', borderRadius: '999px',
    padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
};
