import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { AuthService } from '@/modules/auth/services/auth.service';
import { type AuthStatus } from '@/modules/auth/types/auth-status.type';
import { type User } from '@/modules/user/interfaces/user-form-data.interface';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  verifyTokenExists: () => Promise<void>;
  setAccessToken: (data: { accessToken: string }) => void;
}

export const storeApi: StateCreator<AuthState> = (set) => ({
  status: 'pending',
  token: undefined,
  user: undefined,

  loginUser: async (email: string, password: string) => {
    try {
      const { token, ...user } = await AuthService.login(email, password);

      set({ status: 'authorized', token, user });
    } catch (error) {
      set({ status: 'unauthorized', token: undefined, user: undefined });

      throw error;
    }
  },

  logoutUser: () => {
    set({ status: 'unauthorized', token: undefined, user: undefined });
  },

  verifyTokenExists: async () => {
    try {
      const session = localStorage.getItem('auth-storage');
      if (!session) throw new Error('No session found');

      const parsed = JSON.parse(session);
      const token = parsed?.state?.token;

      if (!token) throw new Error('No token found');

      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        throw new Error('Token expired');
      }

      set({ status: 'authorized', token });
    } catch (error) {
      set({ status: 'unauthorized', token: undefined, user: undefined });
      localStorage.removeItem('auth-storage');
    }
  },

  setAccessToken: (data) => {
    set((state) => ({
      ...state,
      token: data.accessToken,
      status: 'authorized',
    }));
  },
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(storeApi, {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        setTimeout(() => {
          state?.logoutUser?.();
          state!.status = 'pending';
        }, 0);
      },
    })
  )
);
