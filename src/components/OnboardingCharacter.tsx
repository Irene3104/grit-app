import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types';

interface Props {
  onNext: (character: Character) => void;
}

const CHARACTERS: { id: Character; emoji: string; name: string; desc: string }[] = [
  { id: 'tiger', emoji: '🐯', name: '호랑이', desc: '불굴의 의지' },
  { id: 'capybara', emoji: '🦦', name: '카피바라', desc: '여유로운 현자' },
  { id: 'kangaroo', emoji: '🦘', name: '캥거루', desc: '에너지 폭발' },
  { id: 'koala', emoji: '🐨', name: '코알라', desc: '귀엽고 집요한' },
];

export default function OnboardingCharacter({ onNext }: Props) {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <p style={styles.label}>캐릭터를 골라주세요.</p>
      <div style={styles.grid}>
        {CHARACTERS.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.03 }}
            style={{
              ...styles.card,
              ...(selected === c.id ? styles.cardSelected : {}),
            }}
            onClick={() => setSelected(c.id)}
          >
            <span style={styles.emoji}>{c.emoji}</span>
            <span style={styles.name}>{c.name}</span>
            <span style={styles.desc}>{c.desc}</span>
          </motion.button>
        ))}
      </div>
      <motion.button
        animate={{ opacity: selected ? 1 : 0.3 }}
        style={styles.button}
        onClick={() => selected && onNext(selected)}
        whileTap={{ scale: 0.97 }}
      >
        시작하기 →
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  card: {
    background: '#ffffff0d',
    border: '1.5px solid #ffffff20',
    borderRadius: '16px',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardSelected: {
    background: '#ffffff15',
    border: '1.5px solid #ffffff',
  },
  emoji: {
    fontSize: '2.5rem',
  },
  name: {
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
  },
  desc: {
    color: '#ffffff60',
    fontSize: '0.8rem',
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
