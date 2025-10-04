import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  resolvedTheme: 'light' | 'dark';
}

// Function to get system preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Function to apply theme to document
const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  console.log('applyTheme called with:', theme);
  console.log('Current classList:', root.classList.toString());

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  console.log('After update classList:', root.classList.toString());

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      resolvedTheme: getSystemTheme(),

      setMode: (mode) => {
        console.log('setMode called with:', mode);
        set({ mode });

        // Determine the actual theme to apply
        const resolvedTheme = mode === 'auto' ? getSystemTheme() : mode;
        console.log('Resolved theme:', resolvedTheme);
        set({ resolvedTheme });
        applyTheme(resolvedTheme);
      },

      toggleTheme: () => {
        const { resolvedTheme } = get();
        console.log('toggleTheme - current resolvedTheme:', resolvedTheme);
        const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
        console.log('toggleTheme - newMode:', newMode);
        get().setMode(newMode);
      },
    }),
    {
      name: 'weather-theme-storage',
      partialize: (state) => ({
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // After rehydration, apply the stored theme
          const resolvedTheme = state.mode === 'auto' ? getSystemTheme() : state.mode;
          state.resolvedTheme = resolvedTheme;
          applyTheme(resolvedTheme);
        }
      },
    }
  )
);

// Listen for system theme changes when in auto mode
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { mode, setMode } = useThemeStore.getState();
    if (mode === 'auto') {
      const systemTheme = e.matches ? 'dark' : 'light';
      useThemeStore.setState({ resolvedTheme: systemTheme });
      applyTheme(systemTheme);
    }
  });
}
