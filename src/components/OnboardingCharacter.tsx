import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types';
import ClimbingCat from './ClimbingCat';

interface Props {
  onNext: (character: Character) => void;
  onBack: () => void;
}

const CHARACTERS: { id: Character; name: string; desc: string; img?: string }[] = [
  { id: 'cat', name: '고양이', desc: '겁없는 클라이머', img: '/characters/cat-profile-clean.png' },
];

export default function OnboardingCharacter({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Character | null>('cat');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <button style={styles.backBtn} onClick={onBack}>← 뒤로</button>
      <p style={styles.label}>캐릭터를 골라주세요.</p>
      <div style={styles.grid}>
        {CHARACTERS.map((c) => (
          <motion.button key={c.id} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.03 }}
            style={{ ...styles.card, ...(selected === c.id ? styles.cardSelected : {}) }}
            onClick={() => setSelected(c.id)}
          >
            {c.id === 'cat'
              ? <ClimbingCat state="idle" size={80} />
              : <img src={c.img ?? `/characters/${c.id}.png`} alt={c.name} style={styles.charImg} />
            }
            <span style={styles.name}>{c.name}</span>
            <span style={styles.desc}>{c.desc}</span>
          </motion.button>
        ))}
      </div>
      <motion.button animate={{ opacity: selected ? 1 : 0.3 }} style={styles.button}
        onClick={() => selected && onNext(selected)} whileTap={{ scale: 0.97 }}
      >
        시작하기 →
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
    position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none',
    color: '#ffffff60', fontSize: '1rem', cursor: 'pointer',
  },
  label: { fontSize: '1.6rem', fontWeight: '600', color: '#ffffff' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '400px', justifyItems: 'center' },
  card: {
    background: '#ffffff0d', border: '1.5px solid #ffffff20', borderRadius: '16px',
    padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
  },
  cardSelected: { background: '#ffffff15', border: '1.5px solid #ffffff' },
  charImg: { width: '80px', height: '80px', objectFit: 'contain' } as React.CSSProperties,
  name: { color: '#ffffff', fontSize: '1rem', fontWeight: '600' },
  desc: { color: '#ffffff60', fontSize: '0.8rem' },
  button: {
    background: '#ffffff', color: '#000000', border: 'none', borderRadius: '999px',
    padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
};
