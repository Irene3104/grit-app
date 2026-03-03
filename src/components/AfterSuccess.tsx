import { motion } from 'framer-motion';

interface Props {
  onNewTodos: () => void;
  onNewGoal: () => void;
}

export default function AfterSuccess({ onNewTodos, onNewGoal }: Props) {
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p style={styles.title}>오늘도 수고했어요! 🎉</p>
      <p style={styles.sub}>다음은 무엇을 할까요?</p>
      <div style={styles.options}>
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
          style={styles.optionBtn}
          onClick={onNewTodos}
        >
          <span style={styles.optionIcon}>📝</span>
          <span style={styles.optionTitle}>새로운 퀘스트 작성</span>
          <span style={styles.optionDesc}>같은 목표를 향해 계속 나아가기</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
          style={styles.optionBtn}
          onClick={onNewGoal}
        >
          <span style={styles.optionIcon}>🏔️</span>
          <span style={styles.optionTitle}>새로운 목표 설정</span>
          <span style={styles.optionDesc}>새로운 도전을 시작하기</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0a1a0a, #1a2a0a)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '2rem', padding: '2rem',
  },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#ffffff' },
  sub: { color: '#ffffff60', fontSize: '1rem' },
  options: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '360px' },
  optionBtn: {
    background: '#ffffff0d', border: '1.5px solid #ffffff20', borderRadius: '20px',
    padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: '0.4rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
  },
  optionIcon: { fontSize: '1.8rem' },
  optionTitle: { color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' },
  optionDesc: { color: '#ffffff50', fontSize: '0.85rem' },
};
