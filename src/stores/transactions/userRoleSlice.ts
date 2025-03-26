
import { UserRole } from './types';

export interface UserRoleSlice {
  userRole: UserRole;
  userEmail: string | null;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
  resetUserRole: () => void;
}

export const createUserRoleSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
): UserRoleSlice => ({
  userRole: null,
  userEmail: null,
  
  setUserRole: (role, email) => set({ userRole: role, userEmail: email }),
  
  clearUserData: () => set({ userRole: null, userEmail: null }),
  
  resetUserRole: () => {
    set({ userRole: null, userEmail: null });
  }
});
