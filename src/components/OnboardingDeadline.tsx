import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: (hour: string, period: 'AM' | 'PM') => void;
  onBack: () => void;
  initialHour?: string;
  initialPeriod?: 'AM' | 'PM';
}

export default function OnboardingDeadline({ onNext, onBack, initialHour = '11:00', initialPeriod = 'PM' }: Props) {
  const [hour, setHour] = useState(initialHour.split(':')[0] || '11');
  const [minute, setMinute] = useState(initialHour.split(':')[1] || '00');
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);

  // 유효성: hour 1-12, minute 0-59
  const hourNum = parseInt(hour) || 0;
  const minNum = parseInt(minute) || 0;
  const isValid = hourNum >= 1 && hourNum <= 12 && minNum >= 0 && minNum <= 59;

  const displayHour = String(hourNum).padStart(2, '0');
  const displayMin = String(minNum).padStart(2, '0');
  const timeStr = `${displayHour}:${displayMin}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <button style={styles.backBtn} onClick={onBack}>← 뒤로</button>
      <p style={styles.label}>퀘스트 마감 시간을 정해주세요.</p>

      <div style={styles.timeRow}>
        {/* 시 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>시</label>
          <input
            style={styles.timeInput}
            type="number"
            min={1} max={12}
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            placeholder="11"
          />
        </div>

        <span style={styles.colon}>:</span>

        {/* 분 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>분</label>
          <input
            style={styles.timeInput}
            type="number"
            min={0} max={59}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="00"
          />
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

      {/* 미리보기 */}
      <motion.div
        style={styles.preview}
        animate={{ scale: isValid ? 1 : 0.95, opacity: isValid ? 1 : 0.4 }}
      >
        <span style={styles.previewTime}>{isValid ? `${timeStr} ${period}` : '--:-- --'}</span>
      </motion.div>

      <motion.button
        animate={{ opacity: isValid ? 1 : 0.3 }}
        style={styles.button}
        onClick={() => isValid && onNext(timeStr, period)}
        whileTap={{ scale: 0.97 }}
      >
        다음 →
      </motion.button>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh', padding: '2rem', gap: '2rem', position: 'relative',
  },
  backBtn: {
    position: 'absolute', top: '2rem', left: '2rem', background: 'none',
    border: 'none', color: '#ffffff60', fontSize: '1rem', cursor: 'pointer',
  },
  label: { fontSize: '1.6rem', fontWeight: '600', color: '#ffffff', textAlign: 'center' },
  timeRow: { display: 'flex', alignItems: 'flex-end', gap: '0.8rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' },
  inputLabel: { color: '#ffffff60', fontSize: '0.8rem' },
  timeInput: {
    width: '80px', background: '#ffffff0d', border: '1.5px solid #ffffff30',
    borderRadius: '12px', color: '#ffffff', fontSize: '2rem', fontWeight: '700',
    padding: '0.6rem', textAlign: 'center', outline: 'none',
    appearance: 'none', MozAppearance: 'textfield',
  } as React.CSSProperties,
  colon: { color: '#ffffff', fontSize: '2rem', fontWeight: '700', paddingBottom: '0.5rem' },
  periodCol: { display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingBottom: '0.2rem' },
  periodBtn: {
    background: 'none', border: '1px solid #ffffff20', color: '#ffffff60',
    borderRadius: '8px', padding: '0.4rem 0.7rem', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.15s',
  },
  periodBtnActive: { background: '#ffffff', color: '#000000', border: '1px solid #ffffff' },
  preview: { textAlign: 'center' },
  previewTime: { fontSize: '2.8rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' },
  button: {
    background: '#ffffff', color: '#000000', border: 'none', borderRadius: '999px',
    padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
};
