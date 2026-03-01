import { useState, useEffect, useCallback } from 'react';
import type { TodoItem } from '../types';

const TOTAL_METERS = 100;

function calcMetersLeft(progress: number): number {
  return Math.round(TOTAL_METERS * (1 - progress));
}

function getDeadlineMs(hour: string, period: 'AM' | 'PM'): number {
  const now = new Date();
  const [h] = hour.split(':').map(Number);
  let hours24 = h;
  if (period === 'PM' && h !== 12) hours24 = h + 12;
  if (period === 'AM' && h === 12) hours24 = 0;

  const deadline = new Date(now);
  deadline.setHours(hours24, 0, 0, 0);

  // 만약 이미 지났으면 내일로
  if (deadline.getTime() <= now.getTime()) {
    deadline.setDate(deadline.getDate() + 1);
  }
  return deadline.getTime();
}

export function useGameEngine(
  todos: TodoItem[],
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>,
  deadlineHour: string,
  deadlinePeriod: 'AM' | 'PM'
) {
  const deadlineMs = getDeadlineMs(deadlineHour, deadlinePeriod);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const [lives, setLives] = useState(3);
  const [livesDeducted, setLivesDeducted] = useState<Set<string>>(new Set());
  const [slipping, setSlipping] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(deadlineMs - Date.now());
  const [isDead, setIsDead] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 성공 체크
  useEffect(() => {
    if (completedCount === totalCount && totalCount > 0 && !isDead) {
      setIsSuccess(true);
    }
  }, [completedCount, totalCount, isDead]);

  // 타이머
  useEffect(() => {
    if (isDead || isSuccess) return;
    const interval = setInterval(() => {
      const left = deadlineMs - Date.now();
      setTimeLeftMs(left);

      if (left <= 0 && completedCount < totalCount) {
        setIsDead(true);
        return;
      }

      const hasRemaining = completedCount < totalCount;

      // 2시간 전 목숨 -1
      if (left <= 2 * 60 * 60 * 1000 && !livesDeducted.has('2h') && hasRemaining) {
        setLives((l) => Math.max(0, l - 1));
        setLivesDeducted((s) => new Set([...s, '2h']));
        setSlipping(true);
        setTimeout(() => setSlipping(false), 2000);
      }
      // 1시간 전 목숨 -1
      if (left <= 1 * 60 * 60 * 1000 && !livesDeducted.has('1h') && hasRemaining) {
        setLives((l) => Math.max(0, l - 1));
        setLivesDeducted((s) => new Set([...s, '1h']));
        setSlipping(true);
        setTimeout(() => setSlipping(false), 2000);
      }

      // 목숨 0이면 사망
      if (lives <= 0 && hasRemaining) {
        setIsDead(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineMs, completedCount, totalCount, lives, livesDeducted, isDead, isSuccess]);

  const oneHandMode =
    timeLeftMs <= 30 * 60 * 1000 && completedCount < totalCount;

  const metersLeft = calcMetersLeft(progress);

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTodos]
  );

  return {
    lives,
    progress,
    slipping,
    oneHandMode,
    timeLeftMs,
    metersLeft,
    totalMeters: TOTAL_METERS,
    isDead,
    isSuccess,
    toggleTodo,
    completedCount,
    totalCount,
  };
}
