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

            {/* ── 암벽 SVG: 아래 넓고 위 좁은 삼각형 형태, 밝은 회색 바위 ── */}
            <svg
              style={styles.cliffImg as React.CSSProperties}
              viewBox="0 0 80 500"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 메인 암벽 형태: 아래(80) → 위(30) */}
              <polygon points="0,500 80,500 65,0 15,0" fill="#4a4a6a"/>
              {/* 왼쪽 굴곡 */}
              <path d="M0,500 L10,400 L4,300 L12,200 L6,100 L15,0 L0,0 Z" fill="#3a3a5a"/>
              {/* 오른쪽 굴곡 */}
              <path d="M80,500 L70,400 L76,300 L68,200 L74,100 L65,0 L80,0 Z" fill="#3a3a5a"/>
              {/* 바위 면 하이라이트 */}
              <path d="M20,480 L60,480 L56,380 L24,380 Z" fill="#5a5a7a" opacity="0.6"/>
              <path d="M22,360 L58,360 L54,260 L26,260 Z" fill="#5a5a7a" opacity="0.5"/>
              <path d="M24,240 L56,240 L52,140 L28,140 Z" fill="#5a5a a" opacity="0.5"/>
              <path d="M26,120 L54,120 L50,40 L30,40 Z"  fill="#6060 0" opacity="0.4"/>
              {/* 균열 */}
              <path d="M35,500 Q32,420 38,340 Q34,260 40,180 Q36,100 42,20"
                    stroke="#2e2e4e" strokeWidth="2" fill="none" opacity="0.8"/>
              <path d="M50,500 Q54,430 48,350 Q52,270 46,190"
                    stroke="#2e2e4e" strokeWidth="1.5" fill="none" opacity="0.6"/>
              {/* 홀드 (손잡이) — 밝게! */}
              <ellipse cx="35" cy="450" rx="7" ry="4" fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              <ellipse cx="52" cy="380" rx="6" ry="3.5" fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              <ellipse cx="30" cy="300" rx="7" ry="4" fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              <ellipse cx="50" cy="220" rx="6" ry="3.5" fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              <ellipse cx="33" cy="140" rx="6" ry="3.5" fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              <ellipse cx="47" cy="70"  rx="5" ry="3"   fill="#7878a8" stroke="#9898c8" strokeWidth="1"/>
              {/* 이끼/물기 */}
              <ellipse cx="38" cy="340" rx="8" ry="4" fill="#2d6a2d" opacity="0.5"/>
              <ellipse cx="45" cy="190" rx="7" ry="3.5" fill="#2d6a2d" opacity="0.4"/>
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
