import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStorage } from './storage'

interface AuthStore {
  user: Record<string, any> | null
  currentOrder: Record<string, any> | null

  setUser: (user: any) => void
  setCurrentOrder: (order: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ✅ INITIAL STATE (sirf data)
      user: null,
      currentOrder: null,

      // ✅ ACTIONS
      setUser: (data) => set({ user : data}),

      setCurrentOrder: (order) =>
        set({ currentOrder: order }),

      logout: () =>
        set({
          user: null,
          currentOrder: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
