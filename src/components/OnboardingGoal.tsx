import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: (goal: string) => void;
  initialValue?: string;
}

export default function OnboardingGoal({ onNext, initialValue = '' }: Props) {
  const [goal, setGoal] = useState(initialValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <motion.p style={styles.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        목표를 작성하세요.
      </motion.p>
      <motion.input
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5 }}
        style={styles.input}
        type="text"
        placeholder="나의 목표는..."
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && goal.trim() && onNext(goal.trim())}
        autoFocus
      />
      <motion.button
        animate={{ opacity: goal.trim() ? 1 : 0.3 }}
        style={styles.button}
        onClick={() => goal.trim() && onNext(goal.trim())}
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
    justifyContent: 'center', minHeight: '100vh', padding: '2rem', gap: '2rem',
  },
  label: { fontSize: '1.6rem', fontWeight: '600', letterSpacing: '-0.02em', color: '#ffffff' },
  input: {
    width: '100%', maxWidth: '400px', background: 'transparent', border: 'none',
    borderBottom: '2px solid #ffffff40', color: '#ffffff', fontSize: '1.2rem',
    padding: '0.8rem 0', outline: 'none', textAlign: 'center',
  },
  button: {
    marginTop: '1rem', background: '#ffffff', color: '#000000', border: 'none',
    borderRadius: '999px', padding: '0.8rem 2.5rem', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer',
  },
};
