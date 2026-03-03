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
  deadlinePeriod: 'AM' | 'PM',
  onXpReset?: () => void   // 90% 시점에 XP 초기화 콜백
) {
  const deadlineMs = getDeadlineMs(deadlineHour, deadlinePeriod);

  // 총 가용 시간 (퀘스트 시작 시점 기준으로 localStorage에 저장)
  const [totalDurationMs] = useState<number>(() => {
    const saved = localStorage.getItem('grit_session_start');
    const start = saved ? parseInt(saved, 10) : Date.now();
    if (!saved) localStorage.setItem('grit_session_start', String(Date.now()));
    return deadlineMs - start;
  });

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
      // 세션 시작 시간 초기화
      localStorage.removeItem('grit_session_start');
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
        localStorage.removeItem('grit_session_start');
        setIsDead(true);
        return;
      }

      const hasRemaining = completedCount < totalCount;
      // elapsed = 경과 비율 (0~1)
      const elapsed = Math.max(0, 1 - left / totalDurationMs);

      // 50% 경과 → ❤️ -1
      if (elapsed >= 0.5 && !livesDeducted.has('50pct') && hasRemaining) {
        setLives((l) => Math.max(0, l - 1));
        setLivesDeducted((s) => new Set([...s, '50pct']));
        setSlipping(true);
        setTimeout(() => setSlipping(false), 2000);
      }

      // 90% 경과 → ❤️ -1 + XP 초기화 패널티
      if (elapsed >= 0.9 && !livesDeducted.has('90pct') && hasRemaining) {
        setLives((l) => Math.max(0, l - 1));
        setLivesDeducted((s) => new Set([...s, '90pct']));
        setSlipping(true);
        setTimeout(() => setSlipping(false), 2000);
        // XP 리셋 패널티
        onXpReset?.();
      }

      // 목숨 0이면 사망
      if (lives <= 0 && hasRemaining) {
        localStorage.removeItem('grit_session_start');
        setIsDead(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineMs, totalDurationMs, completedCount, totalCount, lives, livesDeducted, isDead, isSuccess, onXpReset]);

  // 위험 상태: 90% 이상 경과
  const elapsed = Math.max(0, 1 - timeLeftMs / totalDurationMs);
  const oneHandMode = elapsed >= 0.9 && completedCount < totalCount;

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
