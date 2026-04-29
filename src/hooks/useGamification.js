import { create } from 'zustand';

export const useGamificationStore = create((set, get) => ({
  xp: parseInt(localStorage.getItem('calisteniapp_xp') || '0'),
  streak: parseInt(localStorage.getItem('calisteniapp_streak') || '0'),
  lastDate: localStorage.getItem('calisteniapp_last_date') || null,
  level: Math.floor(parseInt(localStorage.getItem('calisteniapp_xp') || '0') / 500) + 1,

  addXP: (amount) => {
    const newXP = get().xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    
    localStorage.setItem('calisteniapp_xp', newXP.toString());
    set({ xp: newXP, level: newLevel });
  },

  updateStreak: () => {
    const today = new Date().toLocaleDateString();
    const last = get().lastDate;
    
    if (last === today) return;

    let newStreak = get().streak;
    if (last) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last === yesterday.toLocaleDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    localStorage.setItem('calisteniapp_streak', newStreak.toString());
    localStorage.setItem('calisteniapp_last_date', today);
    set({ streak: newStreak, lastDate: today });
  }
}));
