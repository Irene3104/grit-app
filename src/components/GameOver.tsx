import { motion } from 'framer-motion';
import type { Character } from '../types';

interface Props {
  character: Character;
  onRetry?: () => void;
}

const CHAR_EMOJI: Record<Character, string> = {
  tiger: '🐯',
  capybara: '🦦',
  kangaroo: '🦘',
  koala: '🐨',
};

export default function GameOver({ character, onRetry }: Props) {
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 추락 애니메이션 */}
      <motion.div
        style={styles.fallingChar}
        initial={{ y: -300, rotate: 0, opacity: 1 }}
        animate={{ y: 0, rotate: 720, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeIn' }}
      >
        <span style={{ fontSize: '3.5rem' }}>{CHAR_EMOJI[character]}</span>
      </motion.div>

      {/* 충격 이펙트 */}
      <motion.div
        style={styles.impact}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 1.5], opacity: [0, 1, 0] }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        💥
      </motion.div>

      {/* 바닥 캐릭터 (기절) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={styles.deadChar}
      >
        <span style={{ fontSize: '2.5rem', transform: 'rotate(90deg)', display: 'block' }}>
          {CHAR_EMOJI[character]}
        </span>
        <div style={styles.stars}>⭐💫⭐</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        style={styles.textBlock}
      >
        <p style={styles.title}>추락했습니다.</p>
        <p style={styles.sub}>하지만 다시 일어날 수 있어요.</p>

        {onRetry && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.retryBtn}
            onClick={onRetry}
          >
            다시 도전하기
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #200000, #0a0000)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  fallingChar: {
    position: 'absolute',
    top: '10%',
    fontSize: '3.5rem',
    zIndex: 10,
  },
  impact: {
    position: 'absolute',
    top: '42%',
    fontSize: '3rem',
    zIndex: 5,
  },
  deadChar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '4rem',
  },
  stars: {
    fontSize: '1.2rem',
    letterSpacing: '0.3rem',
  },
  textBlock: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ff4444',
  },
  sub: {
    fontSize: '1rem',
    color: '#ffffff60',
  },
  retryBtn: {
    marginTop: '1rem',
    background: '#ffffff',
    color: '#000',
    border: 'none',
    borderRadius: '999px',
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
