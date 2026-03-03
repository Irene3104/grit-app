import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

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

export const STAGES: CharacterStage[] = [
  {
    name: '슬라임', title: '초보 모험가의 동반자', nextLevel: 3,
    pixels: [
      ['_','_','_','g','g','g','_','_','_'],
      ['_','_','g','G','G','G','g','_','_'],
      ['_','g','G','G','G','G','G','g','_'],
      ['_','g','G','W','K','G','W','K','_'],
      ['_','g','G','G','G','G','G','g','_'],
      ['_','_','g','G','G','G','g','_','_'],
      ['_','_','_','g','g','g','_','_','_'],
    ],
  },
  {
    name: '전사', title: '검을 든 용감한 전사', nextLevel: 6,
    pixels: [
      ['_','_','_','S','s','S','_','_','_'],
      ['_','_','S','s','S','s','S','_','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['_','_','F','W','K','W','K','_','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['_','S','B','B','B','B','B','S','_'],
      ['_','_','_','B','B','B','_','_','_'],
      ['_','_','B','_','_','_','B','_','_'],
    ],
  },
  {
    name: '기사', title: '황금 갑옷의 수호자', nextLevel: 10,
    pixels: [
      ['_','_','Y','y','Y','y','Y','_','_'],
      ['_','Y','y','S','s','S','y','Y','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['_','_','F','W','K','W','K','_','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['R','Y','B','B','Y','B','B','Y','R'],
      ['R','_','_','B','B','B','_','_','R'],
      ['_','_','B','_','_','_','B','_','_'],
    ],
  },
  {
    name: '대마법사', title: '전설의 대마법사', nextLevel: null,
    pixels: [
      ['_','_','_','P','p','P','_','_','_'],
      ['_','_','P','p','Y','p','P','_','_'],
      ['_','P','p','P','p','P','p','P','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['_','_','F','C','K','C','K','_','_'],
      ['_','_','_','F','F','F','_','_','_'],
      ['_','C','P','P','P','P','P','C','_'],
      ['c','_','_','P','P','P','_','_','c'],
      ['_','_','P','_','_','_','P','_','_'],
    ],
  },
];

export function getStage(level: number): CharacterStage {
  if (level >= 10) return STAGES[3];
  if (level >= 6)  return STAGES[2];
  if (level >= 3)  return STAGES[1];
  return STAGES[0];
}

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
  const xpPct = Math.min((xpInLevel / xpPerLevel) * 100, 100);

  // compact 모드: 캐릭터 + 이름만 크게, 나머지 숨김
  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <PixelGrid pixels={stage.pixels} size={14} />
        <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{stage.name}</p>
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
        <p style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{stage.name}</p>
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
            style={{ height: '100%', background: 'linear-gradient(to right, #ffd700, #ffaa00)', borderRadius: '3px' }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p style={{ color: '#ffffff40', fontSize: '0.55rem', textAlign: 'center', marginTop: '0.3rem' }}>
          {stage.nextLevel ? `Lv.${stage.nextLevel}에 ${STAGES[STAGES.indexOf(stage)+1]?.name || ''}` : '최종 형태 🎉'}
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
