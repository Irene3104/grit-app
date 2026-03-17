import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { CREATURES, getCreature, getEvolutionIndex, getNextEvolutionLevel } from '../data/characters';

const PALETTE: Record<string, string> = {
  _: 'transparent',
  G: 'hsl(120 60% 40%)', g: 'hsl(120 50% 55%)',
  W: 'hsl(0 0% 95%)',    K: 'hsl(0 0% 10%)',
  B: 'hsl(220 60% 50%)', b: 'hsl(220 40% 65%)',
  S: 'hsl(0 0% 70%)',    s: 'hsl(0 0% 85%)',
  Y: 'hsl(38 92% 50%)',  y: 'hsl(45 100% 60%)',
  R: 'hsl(0 70% 50%)',   r: 'hsl(0 60% 65%)',
  P: 'hsl(270 60% 50%)', p: 'hsl(270 50% 65%)',
  F: 'hsl(25 70% 50%)',  f: 'hsl(25 60% 65%)',
  H: 'hsl(30 50% 30%)',  O: 'hsl(30 90% 50%)',
  o: 'hsl(40 95% 60%)',  C: 'hsl(190 70% 50%)',
  c: 'hsl(190 60% 70%)',
};

export interface CharacterStage {
  name: string;
  title: string;
  pixels: string[][];
  nextLevel: number | null;
}

// ── 레거시 호환: getStage (레벨 기반) ──
export function getStage(level: number): CharacterStage {
  const creatureType = getCreature() || 'slime';
  const creature = CREATURES[creatureType];
  const evoIdx = getEvolutionIndex(level);
  const stage = creature.stages[evoIdx];
  const nextLv = getNextEvolutionLevel(level);

  return {
    name: stage.name,
    title: stage.title,
    pixels: stage.pixels,
    nextLevel: nextLv,
  };
}

// ── 레거시 호환: STAGES 배열 ──
export const STAGES: CharacterStage[] = (() => {
  const creatureType = getCreature() || 'slime';
  const creature = CREATURES[creatureType];
  const levels = [3, 6, 10, null];
  return creature.stages.map((s, i) => ({
    name: s.name,
    title: s.title,
    pixels: s.pixels,
    nextLevel: levels[i],
  }));
})();

function PixelGrid({ pixels, size = 8 }: { pixels: string[][]; size?: number }) {
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

export function PixelCharacter({ level, xp, xpInLevel, xpPerLevel, compact }: {
  level: number;
  xp: number;
  xpInLevel: number;
  xpPerLevel: number;
  compact?: boolean;
}) {
  const stage = useMemo(() => getStage(level), [level]);
  const creatureType = getCreature() || 'slime';
  const creature = CREATURES[creatureType];
  const evoIdx = getEvolutionIndex(level);
  const xpPct = Math.min((xpInLevel / xpPerLevel) * 100, 100);
  const nextStage = evoIdx < 3 ? creature.stages[evoIdx + 1] : null;

  // compact 모드: 캐릭터 + 이름만 크게, 나머지 숨김
  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <PixelGrid pixels={stage.pixels} size={14} />
        <p style={{ color: creature.color, fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{stage.name}</p>
        <p style={{ color: '#ffffff50', fontSize: '0.72rem', margin: 0 }}>{stage.title}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
      padding: '1rem 0.8rem',
    }}>
      {/* 레벨 */}
      <div style={{ color: '#ffd700', fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        LV.{level}
      </div>

      {/* 픽셀 캐릭터 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.name}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              padding: '0.8rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <PixelGrid pixels={stage.pixels} size={8} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* 캐릭터 이름 */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: creature.color, fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
          {creature.emoji} {stage.name}
        </p>
        <p style={{ color: '#ffffff60', fontSize: '0.6rem', margin: '0.2rem 0 0' }}>{stage.title}</p>
      </div>

      {/* XP 바 */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ color: '#ffffff80', fontSize: '0.6rem', fontFamily: 'monospace' }}>XP</span>
          <span style={{ color: '#ffffff80', fontSize: '0.6rem', fontFamily: 'monospace' }}>
            {xpInLevel}/{xpPerLevel}
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: `linear-gradient(to right, ${creature.color}, #ffaa00)`, borderRadius: '3px' }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p style={{ color: '#ffffff40', fontSize: '0.55rem', textAlign: 'center', marginTop: '0.3rem' }}>
          {nextStage ? `Lv.${stage.nextLevel}에 ${nextStage.name}으로 진화!` : '최종 형태 🎉'}
        </p>
      </div>

      {/* 총 XP */}
      <div style={{
        fontFamily: 'monospace', fontSize: '0.65rem', color: '#ffffff50',
        background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '999px',
      }}>
        총 {xp} XP
      </div>
    </div>
  );
}
