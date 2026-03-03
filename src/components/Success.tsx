import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../types';
import { getStage, STAGES, PixelCharacter } from './PixelCharacter';

interface Props {
  goal: string;
  character: Character;
  xpEarned: number;
  totalXp: number;
  level: number;
  onDone: () => void;
}

// 다음 스테이지까지 XP 계산
function getNextStageInfo(level: number) {
  const stage = getStage(level);
  const stageIdx = STAGES.indexOf(stage);
  const nextStage = STAGES[stageIdx + 1] ?? null;
  const nextLevelNeeded = stage.nextLevel ?? null;
  return { stage, nextStage, nextLevelNeeded };
}

const CONFETTI_COLORS = ['#a78bfa', '#fbbf24', '#34d399', '#f87171', '#60a5fa', '#f472b6'];
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.2,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  size: 5 + Math.random() * 7,
  rotate: Math.random() * 360,
}));

export default function Success({ goal, xpEarned, totalXp, level, onDone }: Props) {
  const [phase, setPhase] = useState(0);
  const { stage, nextStage, nextLevelNeeded } = getNextStageInfo(level);
  const XP_PER_LEVEL = 100;
  const xpInLevel = totalXp % XP_PER_LEVEL;
  const prevXpInLevel = Math.max(0, xpInLevel - xpEarned);
  const xpPct = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100);
  const prevXpPct = Math.min((prevXpInLevel / XP_PER_LEVEL) * 100, 100);
  const didLevelUp = level > Math.floor((totalXp - xpEarned) / XP_PER_LEVEL) + 1;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [totalXp]);

  return (
    <div style={styles.page}>
      {/* 컨페티 */}
      {phase >= 1 && CONFETTI.map((c) => (
        <motion.div key={c.id}
          style={{
            ...styles.confetti,
            left: `${c.x}%`, width: c.size, height: c.size,
            background: c.color, borderRadius: c.id % 3 === 0 ? '50%' : '2px',
          }}
          initial={{ y: -20, opacity: 1, rotate: c.rotate }}
          animate={{ y: '110vh', opacity: 0, rotate: c.rotate + 360 }}
          transition={{ duration: 2.5 + Math.random() * 1.5, delay: c.delay }}
        />
      ))}

      <div style={styles.content}>
        {/* ── 상단 배지 ── */}
        <motion.div style={styles.badge}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
        >
          ✦ QUEST COMPLETE ✦
        </motion.div>

        {/* ── 캐릭터 ── */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div style={styles.charArea}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {/* 현재 레벨 픽셀 캐릭터 — 둥둥 떠다니는 애니메이션 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 20px #a78bfa60)' }}
              >
                <PixelCharacter
                  level={level}
                  xp={totalXp}
                  xpInLevel={totalXp % 100}
                  xpPerLevel={100}
                  compact
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 목표 텍스트 ── */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.p style={styles.goalQuote}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              "{goal}"
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── XP 획득 카드 ── */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div style={styles.xpCard}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220 }}
            >
              <div style={styles.xpCardRow}>
                <span style={styles.xpCardLabel}>⚡ 획득 경험치</span>
                <motion.span style={styles.xpGained}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  +{xpEarned} XP
                </motion.span>
              </div>

              <div style={styles.xpCardRow}>
                <span style={styles.xpCardLabel}>🏆 현재 레벨</span>
                <span style={styles.xpLevelVal}>LV.{level}</span>
              </div>

              {/* XP 진행 바 */}
              <div style={styles.xpBarSection}>
                <div style={styles.xpBarLabels}>
                  <span style={styles.xpBarLabel}>{stage.name}</span>
                  {nextStage && <span style={styles.xpBarLabel}>{nextStage.name}</span>}
                </div>
                <div style={styles.xpBarTrack}>
                  {/* 이전 XP */}
                  <div style={{ ...styles.xpBarPrev, width: `${prevXpPct}%` }} />
                  {/* 새로 얻은 XP 애니메이션 */}
                  <motion.div style={styles.xpBarNew}
                    initial={{ width: `${prevXpPct}%` }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ delay: 0.5, duration: 1.0, ease: 'easeOut' }}
                  />
                </div>
                <div style={styles.xpBarNums}>
                  <span style={styles.xpSmall}>{xpInLevel} / {XP_PER_LEVEL} XP</span>
                  {nextStage && nextLevelNeeded && (
                    <span style={styles.xpSmall}>Lv.{nextLevelNeeded}에 {nextStage.name} 진화</span>
                  )}
                  {!nextStage && <span style={styles.xpSmall}>✨ 최종 형태</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 레벨업 알림 ── */}
        <AnimatePresence>
          {phase >= 2 && didLevelUp && (
            <motion.div style={styles.levelUpBanner}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.8 }}
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                style={{ fontSize: '1.4rem' }}
              >⭐</motion.span>
              <span style={styles.levelUpText}>LEVEL UP! LV.{level} 달성!</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                style={{ fontSize: '1.4rem' }}
              >⭐</motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 스탯 그리드 ── */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div style={styles.statGrid}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div style={styles.statCard}>
                <span style={styles.statIcon}>✅</span>
                <span style={styles.statLabel}>완료 퀘스트</span>
                <span style={styles.statValue}>ALL</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>🔥</span>
                <span style={styles.statLabel}>스트릭</span>
                <span style={styles.statValue}>1일</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 계속하기 버튼 ── */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.button
              style={styles.continueBtn}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.96 }}
              onClick={onDone}
            >
              계속하기 →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 1.2rem',
  },
  confetti: { position: 'absolute', top: 0, pointerEvents: 'none' },
  content: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    zIndex: 1,
  },

  // 배지
  badge: {
    background: '#a78bfa18',
    border: '1px solid #a78bfa50',
    borderRadius: '999px',
    padding: '0.35rem 1.1rem',
    color: '#a78bfa',
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
  },

  // 캐릭터
  charArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' },
  charName: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' },
  charNameText: { color: '#fbbf24', fontSize: '1.1rem', fontWeight: '700' },
  charTitle: { color: '#ffffff50', fontSize: '0.72rem' },

  // 목표
  goalQuote: {
    color: '#ffffff90',
    fontSize: '1rem',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
  },

  // XP 카드
  xpCard: {
    width: '100%',
    background: '#13131e',
    border: '1px solid #a78bfa30',
    borderRadius: '16px',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  xpCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpCardLabel: { color: '#ffffff60', fontSize: '0.82rem' },
  xpGained: {
    color: '#fbbf24',
    fontSize: '1.3rem',
    fontWeight: '800',
    fontFamily: 'monospace',
    textShadow: '0 0 12px #fbbf2460',
  },
  xpLevelVal: {
    color: '#a78bfa',
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  // XP 바
  xpBarSection: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  xpBarLabels: { display: 'flex', justifyContent: 'space-between' },
  xpBarLabel: { color: '#ffffff40', fontSize: '0.65rem' },
  xpBarTrack: {
    width: '100%', height: '8px',
    background: '#ffffff10',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
  },
  xpBarPrev: {
    position: 'absolute', left: 0, top: 0, height: '100%',
    background: '#a78bfa50', borderRadius: '4px',
  },
  xpBarNew: {
    position: 'absolute', left: 0, top: 0, height: '100%',
    background: 'linear-gradient(90deg, #a78bfa, #fbbf24)',
    borderRadius: '4px',
  },
  xpBarNums: { display: 'flex', justifyContent: 'space-between' },
  xpSmall: { color: '#ffffff40', fontSize: '0.62rem' },

  // 레벨업
  levelUpBanner: {
    display: 'flex', alignItems: 'center', gap: '0.7rem',
    background: 'linear-gradient(135deg, #fbbf2420, #a78bfa20)',
    border: '1.5px solid #fbbf2450',
    borderRadius: '12px',
    padding: '0.8rem 1.5rem',
    width: '100%',
    justifyContent: 'center',
  },
  levelUpText: {
    color: '#fbbf24', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.04em',
  },

  // 스탯 그리드
  statGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', width: '100%',
  },
  statCard: {
    background: '#13131e',
    border: '1px solid #ffffff10',
    borderRadius: '12px',
    padding: '0.8rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
  },
  statIcon: { fontSize: '1.2rem' },
  statLabel: { color: '#ffffff40', fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.08em' },
  statValue: { color: '#ffffff', fontSize: '1.3rem', fontWeight: '800', fontFamily: 'monospace' },

  // 버튼
  continueBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    border: 'none',
    borderRadius: '14px',
    padding: '1rem',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
};
