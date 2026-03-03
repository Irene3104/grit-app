import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GritData } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import GameOver from './GameOver';
import Success from './Success';
import PomodoroModal from './PomodoroModal';
import { PixelCharacter, getStage } from './PixelCharacter';
import { LevelUpOverlay } from './LevelUpOverlay';

const XP_PER_LEVEL = 100;

// 퀘스트 텍스트 기반으로 XP 변동 (글자 수로 난이도 반영)
function calcQuestXp(text: string): number {
  const len = text.trim().length;
  if (len <= 5) return 12;
  if (len <= 10) return 15;
  if (len <= 20) return 20;
  if (len <= 35) return 25;
  return 30;
}

function getLevel(xp: number) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
function getXpInLevel(xp: number) { return xp % XP_PER_LEVEL; }

const DURATION_LABEL: Record<string, string> = {
  '1day': '하루', '3days': '3일', '1week': '일주일', 'custom': '',
};

function formatTime(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface Props {
  data: GritData;
  onNewTodos: () => void;
  onNewGoal: () => void;
}

export default function MainScreen({ data, onNewTodos, onNewGoal }: Props) {
  const [todos, setTodos] = useState(data.todos);
  const [pomodoroTodo, setPomodoroTodo] = useState<{ text: string; id: string } | null>(null);
  const pomodoroTodoRef = useRef<{ text: string; id: string } | null>(null);
  pomodoroTodoRef.current = pomodoroTodo;
  const [showSuccess, setShowSuccess] = useState(false);

  // XP — localStorage에서 불러와서 세션 간 유지
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('grit_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [levelUpShow, setLevelUpShow] = useState(false);
  const level = getLevel(xp);
  const xpInLevel = getXpInLevel(xp);
  const prevLevelRef = useRef(level);

  // XP 변경될 때마다 저장
  useEffect(() => {
    localStorage.setItem('grit_xp', String(xp));
  }, [xp]);

  const {
    lives, slipping, oneHandMode, timeLeftMs,
    isDead, isSuccess, toggleTodo, completedCount, totalCount,
  } = useGameEngine(todos, setTodos, data.deadlineHour, data.deadlinePeriod, () => {
    // 90% 경과 패널티: XP 0으로 초기화
    setXp(0);
    localStorage.setItem('grit_xp', '0');
  });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      // 첫 렌더에서는 레벨업 알림 안 띄움 (저장된 XP 로드 시)
      isFirstRender.current = false;
      prevLevelRef.current = level;
      return;
    }
    if (level > prevLevelRef.current) {
      setLevelUpShow(true);
      setTimeout(() => setLevelUpShow(false), 2500);
      prevLevelRef.current = level;
    }
  }, [level]);

  const isUrgent = timeLeftMs <= 2 * 60 * 60 * 1000 && completedCount < totalCount;
  const isCritical = timeLeftMs <= 30 * 60 * 1000 && completedCount < totalCount;
  const durationLabel = DURATION_LABEL[data.duration] || data.customDate;
  const stage = getStage(level);

  if (isDead) return <GameOver character={data.character} onRetry={onNewGoal} />;
  if (isSuccess && !showSuccess) {
    return <Success
      goal={data.goal}
      character={data.character}
      xpEarned={xp}
      totalXp={xp}
      level={level}
      onDone={() => setShowSuccess(true)}
    />;
  }
  if (showSuccess) {
    return (
      <motion.div style={styles.afterSuccess}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      >
        {/* 배지 */}
        <div style={styles.afterBadge}>✦ QUEST BOARD ✦</div>

        {/* 타이틀 */}
        <div style={styles.afterTitleBlock}>
          <p style={styles.successTitle}>퀘스트 완수!</p>
          <p style={styles.successSub}>다음 목표를 선택하세요</p>
        </div>

        {/* 현재 레벨 표시 */}
        <div style={styles.afterLevelRow}>
          <span style={styles.afterLevelIcon}>🏆</span>
          <span style={styles.afterLevelText}>LV.{level} {stage.name}</span>
          <span style={styles.afterLevelXp}>{xp} XP</span>
        </div>

        <div style={styles.successBtns}>
          <motion.button whileTap={{ scale: 0.95 }} style={styles.afterBtnPrimary} onClick={onNewTodos}>
            <div style={styles.afterBtnInner}>
              <span style={styles.afterBtnIcon}>⚔️</span>
              <div>
                <p style={styles.afterBtnTitle}>새로운 퀘스트 작성</p>
                <p style={styles.afterBtnSub}>같은 목표를 향해 계속 나아가기</p>
              </div>
            </div>
            <span style={styles.afterBtnArrow}>→</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} style={styles.afterBtnSecondary} onClick={onNewGoal}>
            <div style={styles.afterBtnInner}>
              <span style={styles.afterBtnIcon}>🗺️</span>
              <div>
                <p style={styles.afterBtnTitle}>새로운 목표 설정</p>
                <p style={styles.afterBtnSub}>새로운 도전을 시작하기</p>
              </div>
            </div>
            <span style={styles.afterBtnArrow}>→</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ ...styles.page, ...(isCritical ? styles.pageCritical : {}) }}>
      {isCritical && (
        <motion.div style={styles.criticalBorder}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* ── 헤더: 목숨 + 타이머 ── */}
      <div style={styles.header}>
        <div style={styles.livesRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span key={i}
              style={{ fontSize: '1.2rem', opacity: i < lives ? 1 : 0.2 }}
              animate={i === lives && slipping ? { scale: [1, 1.5, 1] } : {}}
            >❤️</motion.span>
          ))}
        </div>
        <motion.div style={{ ...styles.timer, ...(isUrgent ? styles.timerUrgent : {}) }}
          animate={isUrgent ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⏱ {formatTime(timeLeftMs)}
        </motion.div>
      </div>

      {/* ── 퀘스트 보드 배지 ── */}
      <div style={styles.boardBadge}>
        ✦ QUEST BOARD ✦
      </div>

      {/* ── 타이틀 ── */}
      <div style={styles.titleBlock}>
        <h1 style={styles.title}>오늘의 퀘스트</h1>
        <p style={styles.titleSub}>퀘스트를 완료하고 경험치를 얻으세요</p>
      </div>

      {/* ── 캐릭터 카드 ── */}
      <div style={styles.charCard}>
        <p style={styles.charCardLabel}>MY CHARACTER</p>
        <div style={styles.charCardBody}>
          <PixelCharacter
            level={level}
            xp={xp}
            xpInLevel={xpInLevel}
            xpPerLevel={XP_PER_LEVEL}
          />
        </div>
        {oneHandMode && (
          <motion.p style={styles.danger}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
          >⚠️ 위험 상태!</motion.p>
        )}
      </div>

      {/* ── 스탯 그리드 ── */}
      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🏆</span>
          <span style={styles.statKey}>LEVEL</span>
          <span style={styles.statVal}>{level}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>⚡</span>
          <span style={styles.statKey}>XP</span>
          <span style={styles.statVal}>{xpInLevel}<span style={styles.statSub}>/{XP_PER_LEVEL}</span></span>
          {/* XP 미니 바 */}
          <div style={styles.miniBarTrack}>
            <motion.div style={styles.miniBarFill}
              animate={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🔥</span>
          <span style={styles.statKey}>STREAK</span>
          <span style={styles.statVal}>1<span style={styles.statSub}> days</span></span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>✅</span>
          <span style={styles.statKey}>DONE</span>
          <span style={styles.statVal}>{completedCount}</span>
        </div>
      </div>

      {/* ── 구분선 ── */}
      <div style={styles.divider} />

      {/* ── 퀘스트 목록 헤더 ── */}
      <div style={styles.questHeader}>
        <p style={styles.questTitle}>⚔️ {durationLabel || '오늘'} 퀘스트</p>
        <p style={styles.questGoal}>{data.goal}</p>
        <p style={styles.questProgress}>{completedCount}/{totalCount} 완료</p>
      </div>

      {/* ── 퀘스트 리스트 ── */}
      <div style={styles.questList}>
        <AnimatePresence>
          {todos.map((todo, idx) => (
            <motion.div key={todo.id}
              style={{ ...styles.questItem, ...(todo.completed ? styles.questItemDone : {}) }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              layout
            >
              {/* 체크박스 */}
              <motion.div
                style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxDone : {}) }}
                animate={todo.completed ? { scale: [1, 1.35, 1] } : {}}
                onClick={() => {
                  if (!todo.completed) setXp(prev => prev + calcQuestXp(todo.text));
                  toggleTodo(todo.id);
                }}
                whileTap={{ scale: 0.88 }}
              >
                {todo.completed && '✓'}
              </motion.div>

              {/* 텍스트 */}
              <span
                style={{ ...styles.questText, ...(todo.completed ? styles.questTextDone : {}) }}
                onClick={() => !todo.completed && setPomodoroTodo({ text: todo.text, id: todo.id })}
              >
                {todo.text}
              </span>

              {/* XP 배지 (탭하면 포모도로) or 완료 태그 */}
              {!todo.completed ? (
                <motion.div
                  style={styles.xpBadgeItem}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPomodoroTodo({ text: todo.text, id: todo.id })}
                >
                  <span style={styles.xpBadgeIcon}>⚡</span>
                  <span style={styles.xpBadgeText}>+{calcQuestXp(todo.text)}</span>
                </motion.div>
              ) : (
                <span style={styles.doneTag}>완료</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 레벨업 오버레이 */}
      <LevelUpOverlay show={levelUpShow} level={level} stageName={stage.name} />

      {/* 포모도로 모달 */}
      <AnimatePresence>
        {pomodoroTodo && (
          <PomodoroModal
            todoText={pomodoroTodo.text}
            onClose={() => setPomodoroTodo(null)}
            onComplete={() => {
              const current = pomodoroTodoRef.current;
              if (current) {
                setTodos(prev => prev.map(t => t.id === current.id ? { ...t, completed: true } : t));
                setXp(prev => prev + calcQuestXp(current.text) * 2); // 포모도로 완료: 2배 XP
                setTimeout(() => setPomodoroTodo(null), 1800);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 1.2rem 3rem',
    overflowY: 'auto',
    position: 'relative',
  },
  pageCritical: { background: 'linear-gradient(to bottom, #1a0808, #0d0d14)' },
  criticalBorder: {
    position: 'fixed', inset: 0, border: '4px solid #ff4444',
    pointerEvents: 'none', zIndex: 100,
  },

  // 헤더
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 0', borderBottom: '1px solid #ffffff0f', marginBottom: '0.8rem',
  },
  livesRow: { display: 'flex', gap: '0.25rem' },
  timer: {
    fontSize: '1.2rem', fontWeight: '800', color: '#ffffff',
    fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace',
  },
  timerUrgent: { color: '#ff6666' },

  // 배지
  boardBadge: {
    alignSelf: 'center',
    background: '#a78bfa18',
    border: '1px solid #a78bfa50',
    borderRadius: '999px',
    padding: '0.3rem 1rem',
    color: '#a78bfa',
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
    marginBottom: '0.6rem',
  },

  // 타이틀
  titleBlock: { textAlign: 'center', marginBottom: '1rem' },
  title: { margin: 0, fontSize: '1.9rem', fontWeight: '800', color: '#ffffff' },
  titleSub: { margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#ffffff60' },

  // 캐릭터 카드
  charCard: {
    background: '#13131e',
    border: '1px solid #ffffff12',
    borderRadius: '16px',
    padding: '1rem',
    marginBottom: '0.8rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  charCardLabel: {
    color: '#ffffff40', fontSize: '0.6rem', letterSpacing: '0.12em',
    fontWeight: '700', margin: '0 0 0.5rem',
  },
  charCardBody: { width: '100%', maxWidth: '200px' },
  danger: { color: '#ff6666', fontSize: '0.85rem', margin: '0.5rem 0 0' },

  // 스탯 그리드
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
    marginBottom: '0.8rem',
  },
  statCard: {
    background: '#13131e',
    border: '1px solid #ffffff10',
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  statIcon: { fontSize: '1rem' },
  statKey: { color: '#ffffff50', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.1em' },
  statVal: { color: '#ffffff', fontSize: '1.6rem', fontWeight: '800', fontFamily: 'monospace', lineHeight: 1 },
  statSub: { color: '#ffffff50', fontSize: '0.8rem', fontWeight: '400' },
  miniBarTrack: {
    marginTop: '0.3rem', height: '4px', background: '#ffffff15', borderRadius: '2px', overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #a78bfa, #f97316)',
    borderRadius: '2px',
  },

  // 구분선
  divider: { height: '1px', background: '#ffffff0f', margin: '0.4rem 0 0.8rem' },

  // 퀘스트 섹션 헤더
  questHeader: { marginBottom: '0.6rem' },
  questTitle: { margin: 0, color: '#ffffff', fontWeight: '700', fontSize: '1rem' },
  questGoal: { margin: '0.2rem 0 0', color: '#a78bfa', fontSize: '0.8rem', fontWeight: '600' },
  questProgress: { margin: '0.1rem 0 0', color: '#ffffff50', fontSize: '0.75rem' },

  // 퀘스트 리스트
  questList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  questItem: {
    display: 'flex', alignItems: 'center', gap: '0.7rem',
    background: '#13131e',
    border: '1px solid #ffffff10',
    borderRadius: '12px',
    padding: '0.9rem 1rem',
    transition: 'all 0.2s',
  },
  questItemDone: { opacity: 0.5, borderColor: '#4ade8030' },
  checkbox: {
    width: '24px', height: '24px', borderRadius: '7px',
    border: '2px solid #ffffff30',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.9rem', color: '#000', flexShrink: 0, cursor: 'pointer',
  },
  checkboxDone: { background: '#4ade80', border: '2px solid #4ade80' },
  questText: { flex: 1, color: '#ffffff', fontSize: '0.95rem', cursor: 'pointer' },
  questTextDone: { textDecoration: 'line-through', color: '#ffffff50' },
  doneTag: {
    color: '#4ade80', fontSize: '0.7rem', fontWeight: '700',
    background: '#4ade8015', borderRadius: '999px', padding: '0.1rem 0.5rem',
    flexShrink: 0,
  },
  xpBadgeItem: {
    display: 'flex', alignItems: 'center', gap: '0.2rem',
    background: 'rgba(202, 138, 4, 0.18)',
    border: '1px solid rgba(202, 138, 4, 0.35)',
    borderRadius: '999px',
    padding: '0.2rem 0.55rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  xpBadgeIcon: {
    fontSize: '0.7rem', color: '#f59e0b',
  },
  xpBadgeText: {
    fontSize: '0.75rem', fontWeight: '700', color: '#fbbf24',
    fontFamily: 'monospace',
  },

  // 성공 후 화면
  afterSuccess: {
    minHeight: '100vh', background: '#0d0d14',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '1.2rem', padding: '2rem 1.4rem',
  },
  afterBadge: {
    background: '#a78bfa18', border: '1px solid #a78bfa50',
    borderRadius: '999px', padding: '0.3rem 1rem',
    color: '#a78bfa', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.12em',
  },
  afterTitleBlock: { textAlign: 'center' as const },
  successTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', margin: 0 },
  successSub: { color: '#ffffff50', margin: '0.3rem 0 0', fontSize: '0.85rem' },
  afterLevelRow: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    background: '#13131e', border: '1px solid #a78bfa30',
    borderRadius: '12px', padding: '0.7rem 1.1rem', width: '100%', maxWidth: '360px',
  },
  afterLevelIcon: { fontSize: '1rem' },
  afterLevelText: { color: '#fbbf24', fontWeight: '700', fontSize: '0.95rem', flex: 1 },
  afterLevelXp: { color: '#ffffff40', fontSize: '0.75rem', fontFamily: 'monospace' },
  successBtns: { display: 'flex', flexDirection: 'column', gap: '0.7rem', width: '100%', maxWidth: '360px' },
  afterBtnPrimary: {
    background: 'linear-gradient(135deg, #a78bfa18, #7c3aed18)',
    border: '1.5px solid #a78bfa40',
    borderRadius: '16px', padding: '1.1rem 1.2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    cursor: 'pointer', textAlign: 'left' as const, width: '100%',
  },
  afterBtnSecondary: {
    background: '#13131e',
    border: '1px solid #ffffff12',
    borderRadius: '16px', padding: '1.1rem 1.2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    cursor: 'pointer', textAlign: 'left' as const, width: '100%',
  },
  afterBtnInner: { display: 'flex', alignItems: 'center', gap: '0.9rem' },
  afterBtnIcon: { fontSize: '1.5rem', flexShrink: 0 },
  afterBtnTitle: { color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', margin: 0 },
  afterBtnSub: { color: '#ffffff40', fontSize: '0.75rem', margin: '0.15rem 0 0' },
  afterBtnArrow: { color: '#ffffff30', fontSize: '1.1rem', flexShrink: 0 },
};
