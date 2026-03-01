import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: (hour: string, period: 'AM' | 'PM') => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return h < 10 ? `0${h}:00` : `${h}:00`;
});

export default function OnboardingDeadline({ onNext }: Props) {
  const [hour, setHour] = useState('11:00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <p style={styles.label}>오늘 할 일의 마감 시간을 정해주세요.</p>
      <div style={styles.timeRow}>
        <select
          style={styles.select}
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <div style={styles.periodToggle}>
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              style={{
                ...styles.periodBtn,
                ...(period === p ? styles.periodBtnActive : {}),
              }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <motion.button
        style={styles.button}
        onClick={() => onNext(hour, period)}
        whileTap={{ scale: 0.97 }}
      >
        다음 →
      </motion.button>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    gap: '2rem',
  },
  label: {
    fontSize: '1.6rem',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    color: '#ffffff',
    textAlign: 'center',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  select: {
    background: 'transparent',
    border: '1.5px solid #ffffff40',
    color: '#ffffff',
    fontSize: '2rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    outline: 'none',
    cursor: 'pointer',
  },
  periodToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  periodBtn: {
    background: 'transparent',
    border: '1px solid #ffffff30',
    color: '#ffffff60',
    borderRadius: '8px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  periodBtnActive: {
    background: '#ffffff',
    color: '#000000',
    border: '1px solid #ffffff',
  },
  button: {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '999px',
    padding: '0.8rem 2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
