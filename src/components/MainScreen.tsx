import { useState } from 'react';
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

// 이미지 경로
const CHAR_IMG: Record<string, string> = {
  tiger: '/characters/tiger.png',
  capybara: '/characters/capybara.png',
  kangaroo: '/characters/kangaroo.png',
  koala: '/characters/koala.png',
  rabbit: '/characters/rabbit.png',
  squirrel: '/characters/squirrel.png',
};

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
  const [pomodoroTodo, setPomodoroTodo] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    lives, progress, slipping, oneHandMode, timeLeftMs,
    metersLeft, isDead, isSuccess, toggleTodo, completedCount, totalCount,
  } = useGameEngine(todos, setTodos, data.deadlineHour, data.deadlinePeriod);

  const isUrgent = timeLeftMs <= 2 * 60 * 60 * 1000 && completedCount < totalCount;
  const isCritical = timeLeftMs <= 30 * 60 * 1000 && completedCount < totalCount;
  const durationLabel = DURATION_LABEL[data.duration] || data.customDate;
  const charBottom = 10 + progress * 75;

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
        {/* 왼쪽: TODO */}
        <div style={styles.left}>
          {/* 목표 — 정상 별과 같은 높이 */}
          <p style={styles.goalText}>{data.goal}</p>
          <p style={styles.durationText}>{durationLabel} 목표</p>
          <p style={styles.progressLabel}>{completedCount}/{totalCount} 완료</p>
          <div style={styles.todoList}>
            {todos.map((todo) => (
              <div key={todo.id} style={styles.todoItem}>
                {/* 체크박스 */}
                <motion.div
                  style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxDone : {}) }}
                  animate={todo.completed ? { scale: [1, 1.3, 1] } : {}}
                  onClick={() => toggleTodo(todo.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  {todo.completed && '✓'}
                </motion.div>
                {/* 할일 텍스트 — 클릭 시 포모도로 */}
                <span
                  style={{ ...styles.todoText, ...(todo.completed ? styles.todoTextDone : {}) }}
                  onClick={() => !todo.completed && setPomodoroTodo(todo.text)}
                >
                  {todo.text}
                </span>
                {/* 타이머 아이콘 힌트 */}
                {!todo.completed && (
                  <span style={styles.timerIcon} onClick={() => setPomodoroTodo(todo.text)}>⏲</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 절벽 */}
        <div style={styles.right}>
          {/* 정상 배지 */}
          <div style={styles.summit}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span>
            <span style={styles.summitLabel}>정상</span>
          </div>

          {/* 암벽 + 캐릭터 래퍼 */}
          <div style={styles.cliffWrap}>

            {/* 남은 거리 태그 */}
            <div style={styles.metersTag}>
              <span style={styles.metersText}>{metersLeft}m</span>
              <span style={styles.metersSubText}>남음</span>
            </div>

            {/* 암벽 이미지 */}
            <img
              src="/cliff-wall.png"
              alt="cliff"
              style={styles.cliffImg}
            />

            {/* 진행도 오버레이 (암벽 위에 어두운 마스크 — 위쪽은 어둡고 완료 부분은 밝아짐) */}
            <motion.div
              style={styles.progressOverlay}
              animate={{ height: `${(1 - progress) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* 캐릭터 — 암벽 왼쪽 테두리에 매달림 */}
            <motion.div
              style={styles.charWrap}
              animate={{ bottom: `${charBottom}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.img
                src={CHAR_IMG[data.character] ?? '/characters/tiger.png'}
                alt="character"
                style={{
                  ...styles.charImg,
                  filter: slipping
                    ? 'drop-shadow(0 0 10px #ff4444) drop-shadow(0 0 4px #ff0000)'
                    : oneHandMode
                    ? 'drop-shadow(0 0 8px #ffaa00) drop-shadow(0 0 3px #ff8800)'
                    : 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
                }}
                animate={
                  slipping
                    ? { x: [-6, 6, -4, 4, 0], y: [0, 8, 2], rotate: [-10, 10, 0] }
                    : oneHandMode
                    ? { x: [0, -4, 0, -4, 0], rotate: [-12, -8, -12], y: [0, 4, 0] }
                    : {
                        // 자연스러운 등반 — 왼손/오른손 번갈아 느낌
                        x: [-2, 2, -3, 3, -2, 2, 0],
                        y: [0, -3, -1, -5, -2, -4, 0],
                        rotate: [-3, 3, -4, 4, -2, 2, 0],
                      }
                }
                transition={
                  slipping
                    ? { duration: 0.5 }
                    : oneHandMode
                    ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                }
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
          <PomodoroModal todoText={pomodoroTodo} onClose={() => setPomodoroTodo(null)} />
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
  mainArea: { display: 'flex', flex: 1 },
  left: { flex: 1, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  goalText: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.3 },
  durationText: { fontSize: '0.8rem', color: '#ffffff40', marginBottom: '0.2rem' },
  progressLabel: { color: '#ffffff80', fontSize: '0.9rem', fontWeight: '600' },
  todoList: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  todoItem: { display: 'flex', alignItems: 'center', gap: '0.7rem' },
  checkbox: {
    width: '20px', height: '20px', borderRadius: '5px', border: '2px solid #ffffff40',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', color: '#000', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s',
  },
  checkboxDone: { background: '#ffffff', border: '2px solid #ffffff' },
  todoText: { color: '#ffffff', fontSize: '0.95rem', flex: 1, cursor: 'pointer' },
  todoTextDone: { textDecoration: 'line-through', color: '#ffffff35' },
  timerIcon: { color: '#ffffff30', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 },
  // 절벽
  right: {
    width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: '0.5rem', paddingBottom: '0.5rem', position: 'relative',
  },
  summit: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', marginBottom: '0.4rem' },
  summitLabel: { color: '#ffffff80', fontSize: '0.7rem' },

  // 암벽 래퍼 — 이미지 + 캐릭터 겹치는 컨테이너
  cliffWrap: {
    flex: 1,
    width: '70px',        // 암벽 너비
    position: 'relative',
    overflow: 'visible',  // 캐릭터가 왼쪽으로 튀어나와야 함
  },

  // 암벽 이미지 — 세로 가득 채움
  cliffImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    borderRadius: '6px 6px 0 0',
  } as React.CSSProperties,

  // 진행 안된 부분 어둡게 (위에서 내려오는 어두운 오버레이)
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgba(0,0,0,0.65)',
    borderRadius: '6px 6px 0 0',
    pointerEvents: 'none',
    zIndex: 2,
  },

  metersTag: {
    position: 'absolute', top: '8px', left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 5,
  },
  metersText: { color: '#ffffff', fontSize: '0.85rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums' },
  metersSubText: { color: '#ffffff80', fontSize: '0.6rem' },

  // 캐릭터 — 암벽 왼쪽 면에 달라붙음
  charWrap: {
    position: 'absolute',
    left: '-30px',         // 암벽 왼쪽으로 튀어나옴
    transform: 'translateX(0)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 10,
  },
  charImg: { width: '72px', height: '72px', objectFit: 'contain' } as React.CSSProperties,
  dangerBadge: { fontSize: '0.85rem', marginTop: '-6px' },
  ground: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0' },
};
