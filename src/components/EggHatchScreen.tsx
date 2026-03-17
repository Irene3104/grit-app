import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EGG_PIXELS, CREATURES, hatchEgg, type CreatureType } from '../data/characters';

const PALETTE: Record<string, string> = {
  _: 'transparent',
  W: 'hsl(0 0% 95%)', w: 'hsl(0 0% 75%)',
  K: 'hsl(0 0% 10%)',
  Y: 'hsl(38 92% 50%)', y: 'hsl(45 80% 40%)',
  G: 'hsl(120 60% 40%)', g: 'hsl(120 50% 55%)',
  R: 'hsl(0 70% 50%)', r: 'hsl(0 60% 65%)',
  P: 'hsl(270 60% 50%)', p: 'hsl(270 50% 65%)',
  F: 'hsl(25 70% 50%)', f: 'hsl(25 60% 65%)',
  S: 'hsl(0 0% 70%)', s: 'hsl(0 0% 85%)',
  B: 'hsl(220 60% 50%)', b: 'hsl(220 40% 65%)',
  C: 'hsl(190 70% 50%)', c: 'hsl(190 60% 70%)',
};

function PixelGrid({ pixels, size = 10 }: { pixels: string[][]; size?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', imageRendering: 'pixelated' }}>
      {pixels.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div key={x} style={{ width: size, height: size, backgroundColor: PALETTE[cell] || 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// 알 흔들기 + 부화 이펙트
const eggShakeVariants = {
  idle: { rotate: 0 },
  shake: {
    rotate: [0, -8, 8, -12, 12, -6, 6, 0],
    transition: { duration: 0.6, ease: 'easeInOut' as const },
  },
};

interface Props {
  onDone: (creature: CreatureType) => void;
}

export default function EggHatchScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'intro' | 'tapping' | 'cracking' | 'hatching' | 'reveal'>('intro');
  const [tapCount, setTapCount] = useState(0);
  const [creature, setCreature] = useState<CreatureType | null>(null);

  const TAPS_NEEDED = 5; // 5번 탭하면 부화

  const handleTap = () => {
    if (phase === 'intro') {
      setPhase('tapping');
      setTapCount(1);
      return;
    }
    if (phase !== 'tapping') return;

    const next = tapCount + 1;
    setTapCount(next);

    if (next >= TAPS_NEEDED) {
      // 부화 시작!
      setPhase('cracking');
      setTimeout(() => {
        const hatched = hatchEgg();
        setCreature(hatched);
        setPhase('hatching');
        setTimeout(() => setPhase('reveal'), 1200);
      }, 800);
    }
  };

  const creatureData = creature ? CREATURES[creature] : null;

  return (
    <div style={styles.container}>
      {/* 배경 파티클 */}
      {phase === 'hatching' || phase === 'reveal' ? (
        [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: creatureData?.color || '#fbbf24',
              borderRadius: '50%',
              left: `${10 + (i * 7)}%`,
              top: `${30 + (i % 4) * 15}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -60 - i * 10],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 5)],
            }}
            transition={{ delay: 0.1 * i, duration: 1.5, ease: 'easeOut' }}
          />
        ))
      ) : null}

      <AnimatePresence mode="wait">
        {/* ── 인트로 + 탭핑 ── */}
        {(phase === 'intro' || phase === 'tapping') && (
          <motion.div key="egg" style={styles.center}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.5 }}
          >
            <p style={styles.title}>
              {phase === 'intro' ? '신비한 알을 발견했다!' : '알을 깨우는 중...'}
            </p>
            <p style={styles.subtitle}>
              {phase === 'intro' ? '탭해서 알을 깨워보세요' : `${tapCount}/${TAPS_NEEDED}`}
            </p>

            {/* 알 */}
            <motion.div
              style={styles.eggWrap}
              variants={eggShakeVariants}
              animate={phase === 'tapping' ? 'shake' : 'idle'}
              key={tapCount} // 탭할 때마다 재트리거
              onClick={handleTap}
              whileTap={{ scale: 0.92 }}
            >
              <div style={styles.eggGlow} />
              <PixelGrid pixels={EGG_PIXELS} size={14} />
            </motion.div>

            {/* 진행 바 */}
            {phase === 'tapping' && (
              <div style={styles.progressTrack}>
                <motion.div
                  style={styles.progressFill}
                  animate={{ width: `${(tapCount / TAPS_NEEDED) * 100}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            )}

            {/* 금이 가는 이펙트 */}
            {tapCount >= 3 && phase === 'tapping' && (
              <motion.p style={styles.crackText}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                금이 가고 있다...! 💥
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── 깨지는 중 ── */}
        {phase === 'cracking' && (
          <motion.div key="cracking" style={styles.center}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 0.8, 1.5, 0],
                rotate: [0, -15, 15, -30, 0],
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <PixelGrid pixels={EGG_PIXELS} size={14} />
            </motion.div>
            {/* 빛 폭발 */}
            <motion.div
              style={styles.lightBurst}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 3], opacity: [1, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </motion.div>
        )}

        {/* ── 부화 중 ── */}
        {phase === 'hatching' && creatureData && (
          <motion.div key="hatching" style={styles.center}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={styles.creatureBox}
            >
              <PixelGrid pixels={creatureData.stages[0].pixels} size={14} />
            </motion.div>
          </motion.div>
        )}

        {/* ── 결과 공개 ── */}
        {phase === 'reveal' && creatureData && (
          <motion.div key="reveal" style={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p style={styles.revealTitle}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {creatureData.emoji} 탄생!
            </motion.p>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={styles.creatureBox}
            >
              <PixelGrid pixels={creatureData.stages[0].pixels} size={14} />
            </motion.div>

            <motion.div style={styles.nameBlock}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p style={{ ...styles.creatureName, color: creatureData.color }}>
                {creatureData.stages[0].name}
              </p>
              <p style={styles.creatureTitle}>{creatureData.stages[0].title}</p>
            </motion.div>

            <motion.p style={styles.revealDesc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              퀘스트를 완료하고 경험치를 모아<br/>최종 형태로 진화시키세요!
            </motion.p>

            <motion.button
              style={styles.continueBtn}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => onDone(creature!)}
            >
              모험 시작하기 ⚔️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    zIndex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: '1.4rem',
    fontWeight: '800',
    margin: 0,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff60',
    fontSize: '0.85rem',
    margin: 0,
  },
  eggWrap: {
    cursor: 'pointer',
    padding: '1.5rem',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    position: 'relative',
  },
  eggGlow: {
    position: 'absolute',
    inset: '-10px',
    borderRadius: '24px',
    background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  progressTrack: {
    width: '200px',
    height: '6px',
    background: '#ffffff15',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #fbbf24, #f97316)',
    borderRadius: '3px',
  },
  crackText: {
    color: '#fbbf24',
    fontSize: '0.85rem',
    fontWeight: '700',
    margin: 0,
  },
  lightBurst: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #fbbf24, transparent)',
  },
  creatureBox: {
    padding: '1.2rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  revealTitle: {
    color: '#fbbf24',
    fontSize: '1.6rem',
    fontWeight: '900',
    margin: 0,
  },
  nameBlock: {
    textAlign: 'center',
  },
  creatureName: {
    fontSize: '1.3rem',
    fontWeight: '800',
    margin: 0,
  },
  creatureTitle: {
    color: '#ffffff60',
    fontSize: '0.8rem',
    margin: '0.2rem 0 0',
  },
  revealDesc: {
    color: '#ffffff50',
    fontSize: '0.8rem',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  continueBtn: {
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    border: 'none',
    borderRadius: '999px',
    padding: '0.8rem 2rem',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};
