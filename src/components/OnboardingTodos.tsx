import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TodoItem } from '../types';

interface Props {
  onNext: (todos: TodoItem[]) => void;
}

export default function OnboardingTodos({ onNext }: Props) {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '', completed: false },
  ]);

  const updateTodo = (id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const addTodo = () => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: '', completed: false },
    ]);
  };

  const removeTodo = (id: string) => {
    if (todos.length === 1) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const canNext = todos.some((t) => t.text.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <p style={styles.label}>할 일 목록을 작성하세요.</p>
      <div style={styles.list}>
        <AnimatePresence>
          {todos.map((todo, idx) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={styles.todoRow}
            >
              <span style={styles.num}>{idx + 1}.</span>
              <input
                style={styles.input}
                type="text"
                placeholder="할 일을 입력하세요"
                value={todo.text}
                onChange={(e) => updateTodo(todo.id, e.target.value)}
                autoFocus={idx === todos.length - 1}
              />
              {todos.length > 1 && (
                <button style={styles.remove} onClick={() => removeTodo(todo.id)}>
                  ✕
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.95 }}
          style={styles.addBtn}
          onClick={addTodo}
        >
          + add
        </motion.button>
      </div>
      <motion.button
        animate={{ opacity: canNext ? 1 : 0.3 }}
        style={styles.button}
        onClick={() => canNext && onNext(todos.filter((t) => t.text.trim()))}
        whileTap={{ scale: 0.97 }}
      >
        다음 →
      </motion.button>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    gap: '1.5rem',
  },
  label: {
    fontSize: '1.6rem',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  list: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  todoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  num: {
    color: '#ffffff60',
    fontSize: '0.9rem',
    minWidth: '1.2rem',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #ffffff30',
    color: '#ffffff',
    fontSize: '1rem',
    padding: '0.6rem 0',
    outline: 'none',
  },
  remove: {
    background: 'none',
    border: 'none',
    color: '#ffffff40',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.2rem',
  },
  addBtn: {
    background: 'none',
    border: '1px dashed #ffffff30',
    color: '#ffffff60',
    borderRadius: '8px',
    padding: '0.6rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    marginTop: '0.3rem',
    transition: 'all 0.2s',
  },
  button: {
    marginTop: '0.5rem',
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '999px',
    padding: '0.8rem 2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
