
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ActivityLogStore, ActivityLog } from './types';

// Re-export the ActivityLog type so it can be imported directly from the store
export type { ActivityLog } from './types';

export const useActivityLogStore = create<ActivityLogStore>()(
  persist(
    (set) => ({
      logs: [],
      
      addActivityLog: (activity) => set((state) => ({ 
        logs: [
          {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ...activity
          },
          ...state.logs.slice(0, 99) // Keep only the last 100 logs
        ] 
      })),
      
      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'activity-logs-storage',
    }
  )
);
