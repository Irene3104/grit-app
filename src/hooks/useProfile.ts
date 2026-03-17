import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('프로필 조회 실패:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateXp = async (newXp: number, newLevel: number) => {
    if (!userId) return;
    const { error } = await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('XP 업데이트 실패:', error);
    } else {
      setProfile(prev => prev ? { ...prev, xp: newXp, level: newLevel } : prev);
    }
  };

  const updateStreak = async (days: number) => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('profiles')
      .update({
        streak_days: days,
        last_active_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) console.error('스트릭 업데이트 실패:', error);
    else setProfile(prev => prev ? { ...prev, streak_days: days, last_active_date: today } : prev);
  };

  const updateCharacter = async (characterType: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('profiles')
      .update({ character_type: characterType, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) console.error('캐릭터 업데이트 실패:', error);
    else setProfile(prev => prev ? { ...prev, character_type: characterType } : prev);
  };

  return { profile, loading, fetchProfile, updateXp, updateStreak, updateCharacter };
}
