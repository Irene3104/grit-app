import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: (duration: string, customDate: string) => void;
  onBack: () => void;
}

const OPTIONS = [
  { id: '1day', label: '하루' },
  { id: '3days', label: '3일' },
  { id: '1week', label: '일주일' },
  { id: 'custom', label: '직접 설정' },
];

export default function OnboardingDuration({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState('');
  const [customDate, setCustomDate] = useState('');
  const canNext = selected && (selected !== 'custom' || customDate.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <button style={styles.backBtn} onClick={onBack}>← 뒤로</button>
      <p style={styles.label}>목표 기간을 설정하세요.</p>
      <div style={styles.options}>
        {OPTIONS.map((opt) => (
          <motion.button key={opt.id} whileTap={{ scale: 0.95 }}
            style={{ ...styles.option, ...(selected === opt.id ? styles.optionSelected : {}) }}
            onClick={() => setSelected(opt.id)}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
      {selected === 'custom' && (
        <motion.input
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={styles.input} type="text" placeholder="예) 2026년 3월 20일"
          value={customDate} onChange={(e) => setCustomDate(e.target.value)} autoFocus
        />
      )}
      <motion.button animate={{ opacity: canNext ? 1 : 0.3 }} style={styles.button}
        onClick={() => canNext && onNext(selected, customDate)} whileTap={{ scale: 0.97 }}
      >
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
  label: { fontSize: '1.6rem', fontWeight: '600', letterSpacing: '-0.02em', color: '#ffffff' },
  options: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' },
  option: {
    background: 'transparent', border: '1.5px solid #ffffff40', color: '#ffffff',
    borderRadius: '999px', padding: '0.7rem 1.8rem', fontSize: '1rem', cursor: 'pointer',
  },
  optionSelected: { background: '#ffffff', color: '#000000', border: '1.5px solid #ffffff' },
  input: {
    width: '100%', maxWidth: '400px', background: 'transparent', border: 'none',
    borderBottom: '2px solid #ffffff40', color: '#ffffff', fontSize: '1.1rem',
    padding: '0.8rem 0', outline: 'none', textAlign: 'center',
  },
  button: {
    marginTop: '0.5rem', background: '#ffffff', color: '#000000', border: 'none',
    borderRadius: '999px', padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
};
