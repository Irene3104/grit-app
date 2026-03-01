import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GritData } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import GameOver from './GameOver';
import Success from './Success';

interface Props {
  data: GritData;
}

const CHAR_EMOJI: Record<string, string> = {
  tiger: '🐯',
  capybara: '🦦',
  kangaroo: '🦘',
  koala: '🐨',
};

function formatTime(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MainScreen({ data }: Props) {
  const [todos, setTodos] = useState(data.todos);

  const {
    lives,
    progress,
    slipping,
    oneHandMode,
    timeLeftMs,
    metersLeft,
    isDead,
    isSuccess,
    toggleTodo,
    completedCount,
    totalCount,
  } = useGameEngine(todos, setTodos, data.deadlineHour, data.deadlinePeriod);

  const isUrgent = timeLeftMs <= 2 * 60 * 60 * 1000 && completedCount < totalCount;
  const isCritical = timeLeftMs <= 30 * 60 * 1000 && completedCount < totalCount;

  if (isDead) return <GameOver character={data.character} />;
  if (isSuccess) return <Success goal={data.goal} character={data.character} />;

  // 캐릭터 절벽 위치 (하단 10% ~ 상단 85%)
  const charBottom = 10 + progress * 75;

  return (
    <div
      style={{
        ...styles.container,
        ...(isCritical ? styles.containerCritical : {}),
      }}
    >
      {/* 긴박함 테두리 깜빡임 */}
      {isCritical && (
        <motion.div
          style={styles.criticalBorder}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* ===== 왼쪽: TODO + 정보 ===== */}
      <div style={styles.left}>
        {/* 목숨 */}
        <div style={styles.livesRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span
              key={i}
              style={{ fontSize: '1.4rem', opacity: i < lives ? 1 : 0.2 }}
              animate={i === lives && slipping ? { scale: [1, 1.5, 1] } : {}}
            >
              ❤️
            </motion.span>
          ))}
        </div>

        {/* 카운트다운 */}
        <motion.div
          style={{
            ...styles.timer,
            ...(isUrgent ? styles.timerUrgent : {}),
          }}
          animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⏱ {formatTime(timeLeftMs)}
        </motion.div>

        {/* 목표 */}
        <p style={styles.goalLabel}>{data.goal}</p>
        <p style={styles.progressLabel}>
          {completedCount}/{totalCount} 완료
        </p>

        {/* TODO 리스트 */}
        <div style={styles.todoList}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              whileTap={{ scale: 0.97 }}
              style={styles.todoItem}
              onClick={() => toggleTodo(todo.id)}
            >
              <motion.div
                style={{
                  ...styles.checkbox,
                  ...(todo.completed ? styles.checkboxDone : {}),
                }}
                animate={todo.completed ? { scale: [1, 1.3, 1] } : {}}
              >
                {todo.completed && '✓'}
              </motion.div>
              <span
                style={{
                  ...styles.todoText,
                  ...(todo.completed ? styles.todoTextDone : {}),
                }}
              >
                {todo.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== 오른쪽: 절벽 ===== */}
      <div style={styles.right}>
        {/* 정상 */}
        <div style={styles.summit}>
          <span style={{ fontSize: '1.2rem' }}>⭐</span>
          <span style={styles.summitLabel}>정상</span>
        </div>

        {/* 절벽 */}
        <div style={styles.cliffWrap}>
          <div style={styles.cliff}>
            {/* 진행 바 */}
            <motion.div
              style={styles.progressBar}
              animate={{ height: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* 거리 표시 */}
            <div style={styles.metersTag}>
              <span style={styles.metersText}>{metersLeft}m</span>
              <span style={styles.metersSubText}>남음</span>
            </div>
          </div>

          {/* 캐릭터 */}
          <AnimatePresence>
            <motion.div
              style={styles.charWrap}
              animate={{
                bottom: `${charBottom}%`,
                x: slipping ? [-8, 8, -8, 0] : 0,
                rotate: oneHandMode ? [-15, 15, -15] : slipping ? [-10, 10, 0] : 0,
              }}
              transition={{
                bottom: { duration: 0.8, ease: 'easeOut' },
                x: { duration: 0.4 },
                rotate: oneHandMode
                  ? { duration: 0.4, repeat: Infinity }
                  : { duration: 0.3 },
              }}
            >
              <motion.span
                style={styles.charEmoji}
                animate={
                  slipping
                    ? { y: [0, 8, 0] }
                    : oneHandMode
                    ? { y: [0, 4, 0] }
                    : { y: [0, -3, 0] }
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {CHAR_EMOJI[data.character]}
              </motion.span>
              {oneHandMode && (
                <motion.div
                  style={styles.dangerBadge}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⚠️
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 바닥 */}
        <div style={styles.ground}>
          <span style={{ fontSize: '1rem' }}>💀</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #080818, #18182a)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 1s',
  },
  containerCritical: {
    background: 'linear-gradient(to bottom, #180808, #2a0808)',
  },
  criticalBorder: {
    position: 'fixed',
    inset: 0,
    border: '4px solid #ff4444',
    pointerEvents: 'none',
    zIndex: 100,
    borderRadius: '0',
  },
  left: {
    flex: 1,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    justifyContent: 'center',
  },
  livesRow: {
    display: 'flex',
    gap: '0.3rem',
    marginBottom: '0.2rem',
  },
  timer: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#ffffff',
    fontVariantNumeric: 'tabular-nums',
  },
  timerUrgent: {
    color: '#ff6666',
  },
  goalLabel: {
    color: '#ffffff50',
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    marginTop: '0.4rem',
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    marginTop: '0.3rem',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    cursor: 'pointer',
    padding: '0.3rem 0',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    border: '2px solid #ffffff40',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#000',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  checkboxDone: {
    background: '#ffffff',
    border: '2px solid #ffffff',
  },
  todoText: {
    color: '#ffffff',
    fontSize: '0.95rem',
  },
  todoTextDone: {
    textDecoration: 'line-through',
    color: '#ffffff35',
  },
  right: {
    width: '130px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    position: 'relative',
  },
  summit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    marginBottom: '0.5rem',
  },
  summitLabel: {
    color: '#ffffff80',
    fontSize: '0.7rem',
  },
  cliffWrap: {
    flex: 1,
    width: '60px',
    position: 'relative',
  },
  cliff: {
    position: 'absolute',
    inset: 0,
    background: '#2a2a3a',
    borderRadius: '6px 6px 0 0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  progressBar: {
    background: 'linear-gradient(to top, #5555ff, #aaaaff)',
    width: '100%',
  },
  metersTag: {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
  },
  metersText: {
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
  },
  metersSubText: {
    color: '#ffffff60',
    fontSize: '0.6rem',
  },
  charWrap: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  charEmoji: {
    fontSize: '1.8rem',
    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))',
    display: 'block',
  },
  dangerBadge: {
    fontSize: '0.8rem',
    marginTop: '-4px',
  },
  ground: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.3rem 0',
  },
};
