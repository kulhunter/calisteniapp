import { create } from 'zustand';

export const useGamificationStore = create((set, get) => ({
  xp: parseInt(localStorage.getItem('calisteniapp_xp') || '0'),
  streak: parseInt(localStorage.getItem('calisteniapp_streak') || '0'),
  lastDate: localStorage.getItem('calisteniapp_last_date') || null,
  level: Math.floor(parseInt(localStorage.getItem('calisteniapp_xp') || '0') / 500) + 1,
  completedNodes: JSON.parse(localStorage.getItem('calisteniapp_completed_nodes') || '[]'),
  currentWorldId: localStorage.getItem('calisteniapp_current_world') || 'world_1',

  addXP: (amount) => {
    const newXP = get().xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    localStorage.setItem('calisteniapp_xp', newXP.toString());
    set({ xp: newXP, level: newLevel });
  },

  completeNode: (nodeId) => {
    const completed = get().completedNodes;
    if (completed.includes(nodeId)) return;
    const updated = [...completed, nodeId];
    localStorage.setItem('calisteniapp_completed_nodes', JSON.stringify(updated));
    set({ completedNodes: updated });
  },

  setWorld: (worldId) => {
    localStorage.setItem('calisteniapp_current_world', worldId);
    set({ currentWorldId: worldId });
  },

  updateStreak: () => {
    const today = new Date().toLocaleDateString();
    const last = get().lastDate;
    
    if (last === today) return;

    let newStreak = get().streak;
    if (last) {
      const lastDateObj = new Date(last);
      const todayDateObj = new Date(today);
      const diffTime = Math.abs(todayDateObj - lastDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
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
