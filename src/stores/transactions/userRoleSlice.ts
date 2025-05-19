
import { UserRole, TransactionState } from './types';

export interface UserRoleSlice {
  userRole: UserRole;
  userEmail: string | null;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
  resetUserRole: () => void;
  isAuthenticated: () => boolean;
}

export const createUserRoleSlice = (
  set: (fn: (state: TransactionState) => Partial<TransactionState>) => void,
  get: () => TransactionState
): UserRoleSlice => ({
  userRole: null,
  userEmail: null,
  
  setUserRole: (role, email) => set((state) => ({ 
    userRole: role, 
    userEmail: email 
  })),
  
  clearUserData: () => set((state) => ({ 
    userRole: null, 
    userEmail: null 
  })),
  
  resetUserRole: () => {
    set((state) => ({ 
      userRole: null, 
      userEmail: null 
    }));
  },
  
  isAuthenticated: () => {
    const state = get();
    return state.userEmail !== null && state.userRole !== null;
  }
});
