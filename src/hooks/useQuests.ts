import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { TodoItem } from '../types';

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestItem = Database['public']['Tables']['quest_items']['Row'];

export function useQuests(userId: string | undefined) {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questItems, setQuestItems] = useState<QuestItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 활성 퀘스트 조회
  const fetchActiveQuest = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: quest } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (quest) {
      setActiveQuest(quest);
      const { data: items } = await supabase
        .from('quest_items')
        .select('*')
        .eq('quest_id', quest.id)
        .order('order_index', { ascending: true });
      setQuestItems(items || []);
    }
    setLoading(false);
  }, [userId]);

  // 새 퀘스트 생성
  const createQuest = async (
    goal: string,
    duration: string,
    customDate: string,
    deadlineHour: string,
    deadlinePeriod: 'AM' | 'PM',
    todos: TodoItem[],
  ) => {
    if (!userId) return null;

    const { data: quest, error: questError } = await supabase
      .from('quests')
      .insert({
        user_id: userId,
        goal,
        duration,
        custom_date: customDate || null,
        deadline_hour: deadlineHour,
        deadline_period: deadlinePeriod,
      })
      .select()
      .single();

    if (questError || !quest) {
      console.error('퀘스트 생성 실패:', questError);
      return null;
    }

    // 퀘스트 아이템 생성
    const items = todos.map((todo, idx) => ({
      quest_id: quest.id,
      user_id: userId,
      text: todo.text,
      order_index: idx,
    }));

    const { data: createdItems, error: itemsError } = await supabase
      .from('quest_items')
      .insert(items)
      .select();

    if (itemsError) {
      console.error('퀘스트 아이템 생성 실패:', itemsError);
    }

    setActiveQuest(quest);
    setQuestItems(createdItems || []);
    return quest;
  };

  // 퀘스트 아이템 완료 토글
  const toggleQuestItem = async (itemId: string, completed: boolean, xpEarned: number) => {
    const { error } = await supabase
      .from('quest_items')
      .update({
        completed,
        xp_earned: completed ? xpEarned : 0,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', itemId);

    if (error) {
      console.error('아이템 업데이트 실패:', error);
    } else {
      setQuestItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, completed, xp_earned: completed ? xpEarned : 0, completed_at: completed ? new Date().toISOString() : null }
            : item
        )
      );
    }
  };

  // 퀘스트 상태 업데이트
  const updateQuestStatus = async (questId: string, status: 'completed' | 'failed') => {
    const { error } = await supabase
      .from('quests')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', questId);

    if (error) console.error('퀘스트 상태 업데이트 실패:', error);
  };

  // 데일리 사이드 퀘스트 완료 로그
  const logDailyQuest = async (dailyQuestId: number, xpEarned: number) => {
    if (!userId) return false;
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('daily_quest_logs')
      .insert({
        user_id: userId,
        quest_id: dailyQuestId,
        completed_date: today,
        xp_earned: xpEarned,
      });

    if (error) {
      // UNIQUE 제약 위반 = 이미 오늘 완료
      if (error.code === '23505') return false;
      console.error('데일리 퀘스트 로그 실패:', error);
      return false;
    }
    return true;
  };

  // 오늘 데일리 퀘스트 완료 여부
  const checkDailyQuestDone = async (): Promise<boolean> => {
    if (!userId) return false;
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('daily_quest_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('completed_date', today)
      .limit(1);

    return (data?.length ?? 0) > 0;
  };

  return {
    activeQuest,
    questItems,
    loading,
    fetchActiveQuest,
    createQuest,
    toggleQuestItem,
    updateQuestStatus,
    logDailyQuest,
    checkDailyQuestDone,
  };
}
