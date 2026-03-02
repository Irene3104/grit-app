import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GritData } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import GameOver from './GameOver';
import Success from './Success';
import PomodoroModal from './PomodoroModal';

interface Props {
  data: GritData;
  onNewTodos: () => void;
  onNewGoal: () => void;
}

// (스프라이트 이미지 → ClimbingCat SVG 컴포넌트로 대체)

// (상태별 이미지는 ClimbingCat SVG로 대체됨)

const DURATION_LABEL: Record<string, string> = {
  '1day': '하루',
  '3days': '3일',
  '1week': '일주일',
  'custom': '',
};

function formatTime(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MainScreen({ data, onNewTodos, onNewGoal }: Props) {
  const [todos, setTodos] = useState(data.todos);
  const [pomodoroTodo, setPomodoroTodo] = useState<{ text: string; id: string } | null>(null);
  const pomodoroTodoRef = useRef<{ text: string; id: string } | null>(null);
  pomodoroTodoRef.current = pomodoroTodo; // 항상 최신값 유지
  const toggleTodoRef = useRef<(id: string) => void>(() => {});
  const [showSuccess, setShowSuccess] = useState(false);

  // 스프라이트 프레임 전환
  // 픽셀아트 등반 8프레임
  const wallFrames = Array.from({ length: 8 }, (_, i) => `/characters/climb-frame-${i}.png`);
  const [frameIdx, setFrameIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrameIdx(i => (i + 1) % wallFrames.length), 120); // 빠르게 교체
    return () => clearInterval(id);
  }, []);

  const {
    lives, progress, slipping, oneHandMode, timeLeftMs,
    metersLeft, isDead, isSuccess, toggleTodo, completedCount, totalCount,
  } = useGameEngine(todos, setTodos, data.deadlineHour, data.deadlinePeriod);
  toggleTodoRef.current = toggleTodo; // 항상 최신 toggleTodo 유지

  const isUrgent = timeLeftMs <= 2 * 60 * 60 * 1000 && completedCount < totalCount;
  const isCritical = timeLeftMs <= 30 * 60 * 1000 && completedCount < totalCount;
  const durationLabel = DURATION_LABEL[data.duration] || data.customDate;

  // 클리프 존 실제 높이 측정
  const cliffZoneRef = useRef<HTMLDivElement>(null);
  const [cliffHeight, setCliffHeight] = useState(0);
  useEffect(() => {
    const el = cliffZoneRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setCliffHeight(el.clientHeight));
    obs.observe(el);
    setCliffHeight(el.clientHeight);
    return () => obs.disconnect();
  }, []);

  // 캐릭터 픽셀 위치 (bottom 기준)
  // progress=0 → 바닥(bottom=8px), progress=1 → 정상(bottom=cliffHeight-80px)
  const CHAR_SIZE = 64;
  const BOTTOM_PAD = 8;
  const TOP_PAD = 16;
  const charBottomPx = cliffHeight > 0
    ? BOTTOM_PAD + progress * (cliffHeight - CHAR_SIZE - BOTTOM_PAD - TOP_PAD)
    : BOTTOM_PAD;

  if (isDead) return <GameOver character={data.character} onRetry={onNewGoal} />;

  if (isSuccess && !showSuccess) {
    // 성공 씬 보여주고 나서 선택화면으로
    return <Success goal={data.goal} character={data.character} onDone={() => setShowSuccess(true)} />;
  }

  if (showSuccess) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a1a0a, #1a2a0a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem' }}>
        <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff' }}>오늘도 수고했어요! 🎉</p>
        <p style={{ color: '#ffffff60' }}>다음은 무엇을 할까요?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '360px' }}>
          <motion.button whileTap={{ scale: 0.95 }}
            style={{ background: '#ffffff0d', border: '1.5px solid #ffffff20', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', cursor: 'pointer' }}
            onClick={onNewTodos}
          >
            <span style={{ fontSize: '1.8rem' }}>📝</span>
            <span style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>새로운 할 일 작성</span>
            <span style={{ color: '#ffffff50', fontSize: '0.85rem' }}>같은 목표를 향해 계속 나아가기</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }}
            style={{ background: '#ffffff0d', border: '1.5px solid #ffffff20', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', cursor: 'pointer' }}
            onClick={onNewGoal}
          >
            <span style={{ fontSize: '1.8rem' }}>🏔️</span>
            <span style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>새로운 목표 설정</span>
            <span style={{ color: '#ffffff50', fontSize: '0.85rem' }}>새로운 도전을 시작하기</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, ...(isCritical ? styles.containerCritical : {}) }}>
      {isCritical && (
        <motion.div style={styles.criticalBorder}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* ===== 상단 헤더 ===== */}
      <div style={styles.header}>
        {/* 왼쪽: 하트 */}
        <div style={styles.livesRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span key={i} style={{ fontSize: '1.3rem', opacity: i < lives ? 1 : 0.2 }}
              animate={i === lives && slipping ? { scale: [1, 1.5, 1] } : {}}
            >❤️</motion.span>
          ))}
        </div>

        {/* 중앙: 타이머 */}
        <motion.div style={{ ...styles.timer, ...(isUrgent ? styles.timerUrgent : {}) }}
          animate={isUrgent ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⏱ {formatTime(timeLeftMs)}
        </motion.div>

        {/* 오른쪽: 빈 공간 (밸런스용) */}
        <div style={{ width: '80px' }} />
      </div>

      {/* ===== 메인 영역 ===== */}
      <div style={styles.mainArea}>
        {/* 왼쪽: TODO — 오른쪽 암벽 너비만큼 패딩 확보 */}
        <div style={styles.left}>
          <p style={styles.goalText}>{data.goal}</p>
          <p style={styles.durationText}>{durationLabel} 목표</p>
          <p style={styles.progressLabel}>{completedCount}/{totalCount} 완료</p>
          <div style={styles.todoList}>
            {todos.map((todo) => (
              <div key={todo.id} style={styles.todoItem}>
                <motion.div
                  style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxDone : {}) }}
                  animate={todo.completed ? { scale: [1, 1.3, 1] } : {}}
                  onClick={() => toggleTodo(todo.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  {todo.completed && '✓'}
                </motion.div>
                <span
                  style={{ ...styles.todoText, ...(todo.completed ? styles.todoTextDone : {}) }}
                  onClick={() => !todo.completed && setPomodoroTodo({ text: todo.text, id: todo.id })}
                >
                  {todo.text}
                </span>
                {!todo.completed && (
                  <span style={styles.timerIcon} onClick={() => setPomodoroTodo({ text: todo.text, id: todo.id })}>⏲</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== 암벽 패널 — 화면 오른쪽 끝 고정 ===== */}
        <div style={styles.cliffPanel}>

          {/* 암벽 구역 */}
          <div style={styles.cliffZone} ref={cliffZoneRef}>

            {/* ── 암벽 SVG: 직각삼각형 + 울퉁불퉁 왼쪽 면 ── */}
            <svg
              style={styles.cliffImg as React.CSSProperties}
              viewBox="0 0 80 500"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 직각삼각형 기본형: 오른쪽 직각, 왼쪽이 경사면 */}
              {/* 바닥 오른쪽(80,500) → 꼭대기 오른쪽(80,0) → 꼭대기 왼쪽(20,0) */}
              <polygon points="80,500 80,0 18,0" fill="#3a3d52"/>

              {/* 울퉁불퉁한 왼쪽 경사면 (캐릭터가 오르는 면) */}
              <path d="
                M18,0
                L22,30  L14,55
                L24,80  L12,110
                L20,135 L10,160
                L22,185 L14,215
                L26,240 L16,265
                L24,290 L12,318
                L22,345 L14,370
                L26,395 L16,420
                L24,448 L18,475
                L20,500 L80,500 L80,0 Z
              " fill="#464966"/>

              {/* 경사면 암석 돌출부 (울퉁불퉁 강조) */}
              <path d="M14,55  L4,65  L14,72"  fill="#525578" stroke="#5a5e80" strokeWidth="0.5"/>
              <path d="M10,160 L2,172 L12,180" fill="#525578" stroke="#5a5e80" strokeWidth="0.5"/>
              <path d="M12,318 L2,330 L14,338" fill="#525578" stroke="#5a5e80" strokeWidth="0.5"/>
              <path d="M14,370 L4,382 L16,390" fill="#525578" stroke="#5a5e80" strokeWidth="0.5"/>

              {/* 바위 면 레이어감 */}
              <path d="M40,500 L80,500 L80,350 L50,350 Z" fill="#404360" opacity="0.5"/>
              <path d="M50,340 L80,340 L80,180 L60,180 Z" fill="#404360" opacity="0.4"/>
              <path d="M60,170 L80,170 L80,60  L68,60  Z" fill="#3a3d52" opacity="0.6"/>

              {/* 수직 균열선 */}
              <path d="M60,500 Q57,420 62,340 Q58,260 63,180 Q59,100 64,20"
                    stroke="#2d3045" strokeWidth="1.5" fill="none" opacity="0.7"/>
              <path d="M72,500 Q70,400 73,300 Q71,200 74,100"
                    stroke="#2d3045" strokeWidth="1" fill="none" opacity="0.5"/>

              {/* 홀드 — 경사면 위에 */}
              <ellipse cx="20" cy="60"  rx="5" ry="3" fill="#6e7099" stroke="#8888bb" strokeWidth="0.8"/>
              <ellipse cx="16" cy="155" rx="5" ry="3" fill="#6e7099" stroke="#8888bb" strokeWidth="0.8"/>
              <ellipse cx="20" cy="255" rx="5" ry="3" fill="#6e7099" stroke="#8888bb" strokeWidth="0.8"/>
              <ellipse cx="16" cy="350" rx="5" ry="3" fill="#6e7099" stroke="#8888bb" strokeWidth="0.8"/>
              <ellipse cx="20" cy="445" rx="5" ry="3" fill="#6e7099" stroke="#8888bb" strokeWidth="0.8"/>

              {/* 이끼 */}
              <ellipse cx="25" cy="200" rx="7" ry="3" fill="#2d5a2d" opacity="0.5"/>
              <ellipse cx="22" cy="380" rx="6" ry="2.5" fill="#2d5a2d" opacity="0.4"/>
            </svg>

            {/* 정상 표시 — 암벽 상단에 */}
            <div style={styles.summit}>
              <span style={{ fontSize: '1.2rem' }}>⭐</span>
              <span style={styles.summitLabel}>정상</span>
            </div>

            {/* 남은 거리 — 정상 바로 아래 */}
            <div style={styles.metersTag}>
              <span style={styles.metersText}>{metersLeft}m</span>
              <span style={styles.metersSubText}>남음</span>
            </div>

            {/* 미완료 구간 어두운 오버레이 */}
            <motion.div
              style={styles.progressOverlay}
              animate={{ height: `${(1 - progress) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* 캐릭터 — 할일 완료에 따라 위로 이동 */}
            <motion.div
              style={{
                ...styles.charWrap,
                filter: slipping ? 'drop-shadow(0 0 10px #ff4444)' : undefined,
              }}
              animate={{
                bottom: charBottomPx,
                x: slipping ? [-6, 6, -4, 4, 0] : 0,
              }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            >
              <motion.img
                src={wallFrames[frameIdx]}
                alt="cat climbing"
                style={{
                  width: '56px',
                  height: '112px',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',  // 픽셀아트 선명하게
                  filter: slipping
                    ? 'drop-shadow(0 0 6px #ff4444) hue-rotate(0deg)'
                    : oneHandMode
                    ? 'drop-shadow(0 0 5px #ffaa00)'
                    : 'none',
                } as React.CSSProperties}
              />
              {oneHandMode && (
                <motion.div
                  style={styles.dangerBadge}
                  animate={{ opacity: [1, 0.2, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >⚠️</motion.div>
              )}
            </motion.div>
          </div>

          {/* 바닥 */}
          <div style={styles.ground}>
            <span style={{ fontSize: '1rem' }}>💀</span>
          </div>
        </div>
      </div>

      {/* 포모도로 모달 */}
      <AnimatePresence>
        {pomodoroTodo && (
          <PomodoroModal
            todoText={pomodoroTodo.text}
            onClose={() => setPomodoroTodo(null)}

            onComplete={() => {
                const current = pomodoroTodoRef.current;
                if (current) {
                  // 직접 setTodos로 체크 — toggleTodo ref 우회
                  setTodos(prev =>
                    prev.map(t => t.id === current.id ? { ...t, completed: true } : t)
                  );
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
  container: {
    display: 'flex', flexDirection: 'column', minHeight: '100vh',
    background: 'linear-gradient(to bottom, #080818, #18182a)', position: 'relative', overflow: 'hidden',
  },
  containerCritical: { background: 'linear-gradient(to bottom, #180808, #2a0808)' },
  criticalBorder: {
    position: 'fixed', inset: 0, border: '4px solid #ff4444',
    pointerEvents: 'none', zIndex: 100,
  },
  // 헤더
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.5rem',
  },
  livesRow: { display: 'flex', gap: '0.3rem', width: '80px' },
  timer: { fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', fontVariantNumeric: 'tabular-nums' },
  timerUrgent: { color: '#ff6666' },
  // 메인
  mainArea: { display: 'flex', flex: 1, position: 'relative' },
  goalText: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.3 },
  durationText: { fontSize: '0.8rem', color: '#ffffff40', marginBottom: '0.2rem' },
  progressLabel: { color: '#ffffff80', fontSize: '0.9rem', fontWeight: '600' },
  todoList: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  todoItem: { display: 'flex', alignItems: 'center', gap: '0.7rem' },
  checkbox: {
    width: '22px', height: '22px', borderRadius: '6px', border: '2px solid #ffffff40',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', color: '#000000', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s',
  },
  checkboxDone: { background: '#4ade80', border: '2px solid #4ade80', color: '#000000' },
  todoText: { color: '#ffffff', fontSize: '0.95rem', flex: 1, cursor: 'pointer' },
  todoTextDone: { textDecoration: 'line-through', color: '#ffffff35' },
  timerIcon: { color: '#ffffff30', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 },
  // 왼쪽 할일 영역 — 오른쪽 암벽 너비(80px) 피해서
  left: {
    flex: 1,
    padding: '1rem 1.2rem',
    paddingRight: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    minWidth: 0,
  },

  // ===== 암벽 패널 — 화면 오른쪽 끝 고정, 세로 전체 =====
  cliffPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100px',
    zIndex: 20,
    overflow: 'visible',
  },

  // 정상 — cliffZone 안, 상단 중앙
  summit: {
    position: 'absolute',
    top: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.1rem',
    zIndex: 25,
    whiteSpace: 'nowrap',
  },
  summitLabel: { color: '#ffffffcc', fontSize: '0.6rem', fontWeight: '600' },

  // 암벽 이미지 — 오른쪽 끝에 딱 붙어서 세로 전체
  cliffZone: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '72px',
    overflow: 'visible',
  },

  cliffImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '72px',
    height: '100%',
  } as React.CSSProperties,

  progressOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '72px',
    background: 'rgba(0,0,0,0.55)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  // 남은 거리 — 정상 별 바로 아래
  metersTag: {
    position: 'absolute',
    top: '46px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
    whiteSpace: 'nowrap',
  },
  metersText: { color: '#ffffff', fontSize: '0.78rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums' },
  metersSubText: { color: '#ffffff80', fontSize: '0.56rem' },

  // 캐릭터 — 암벽 왼쪽 면에 달라붙어서 이동
  charWrap: {
    position: 'absolute',
    right: '30px',             // 암벽(72px) 안쪽 왼쪽 면에 걸침
    bottom: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  charImg: { width: '64px', height: '64px', objectFit: 'contain' } as React.CSSProperties,
  dangerBadge: { fontSize: '0.8rem', marginTop: '-4px' },
  ground: {
    position: 'absolute',
    bottom: '4px',
    right: '0',
    width: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
};
