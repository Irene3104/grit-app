import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GritData, TodoItem } from '../types';

interface Props {
  data: GritData;
}

const CHAR_EMOJI: Record<string, string> = {
  tiger: '🐯',
  capybara: '🦦',
  kangaroo: '🦘',
  koala: '🐨',
};

export default function MainScreen({ data }: Props) {
  const [todos, setTodos] = useState<TodoItem[]>(data.todos);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // 캐릭터 위치: 0% = 절벽 하단, 100% = 절벽 상단
  const charPosition = progress; // 0 ~ 1

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div style={styles.container}>
      {/* 왼쪽: TODO 리스트 */}
      <div style={styles.left}>
        <p style={styles.goalLabel}>{data.goal}</p>
        <p style={styles.progressLabel}>
          {completedCount}/{totalCount} 완료
        </p>
        <div style={styles.todoList}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              whileTap={{ scale: 0.98 }}
              style={styles.todoItem}
              onClick={() => toggleTodo(todo.id)}
            >
              <motion.div
                style={{
                  ...styles.checkbox,
                  ...(todo.completed ? styles.checkboxDone : {}),
                }}
                animate={todo.completed ? { scale: [1, 1.2, 1] } : {}}
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
        <p style={styles.deadline}>
          마감: {data.deadlineHour} {data.deadlinePeriod}
        </p>
      </div>

      {/* 오른쪽: 절벽 + 캐릭터 */}
      <div style={styles.right}>
        <div style={styles.cliffWrap}>
          {/* 절벽 배경 */}
          <div style={styles.cliff}>
            {/* 진행도 바 */}
            <motion.div
              style={styles.progressBar}
              initial={{ height: '0%' }}
              animate={{ height: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* 캐릭터 */}
          <motion.div
            style={styles.character}
            animate={{
              bottom: `calc(${charPosition * 75}% + 10px)`,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              style={styles.charEmoji}
              animate={
                completedCount > 0
                  ? { y: [0, -4, 0] }
                  : { rotate: [-2, 2, -2] }
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {CHAR_EMOJI[data.character]}
            </motion.span>
          </motion.div>

          {/* 정상 표시 */}
          <div style={styles.summit}>
            <span style={styles.summitStar}>⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0a0a1a, #1a1a2a)',
  },
  left: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
  },
  goalLabel: {
    color: '#ffffff80',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '0.5rem',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    padding: '0.4rem 0',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #ffffff40',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
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
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  todoTextDone: {
    textDecoration: 'line-through',
    color: '#ffffff40',
  },
  deadline: {
    color: '#ffffff40',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  right: {
    width: '160px',
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
  },
  cliffWrap: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
  },
  cliff: {
    position: 'absolute',
    right: '40px',
    top: 0,
    bottom: 0,
    width: '50px',
    background: '#2a2a3a',
    borderRadius: '8px 8px 0 0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  progressBar: {
    background: 'linear-gradient(to top, #4a4aff, #8a8aff)',
    width: '100%',
    transition: 'height 0.8s ease',
  },
  character: {
    position: 'absolute',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'bottom 0.8s ease',
  },
  charEmoji: {
    fontSize: '2.2rem',
    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
  },
  summit: {
    position: 'absolute',
    top: '20px',
    right: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summitStar: {
    fontSize: '1.5rem',
  },
};
