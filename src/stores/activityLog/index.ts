
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ActivityLog, ActivityLogStore } from './types';

export const useActivityLogStore = create<ActivityLogStore>()(
  persist(
    (set) => ({
      logs: [],
      addActivityLog: (activity) => set((state) => ({
        logs: [{
          ...activity,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        }, ...state.logs]
      })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'activity-logs',
    }
  )
);

export * from './types';
