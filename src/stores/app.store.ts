import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location, Units } from '../types';

interface AppStore {
  // User Preferences
  units: Units;
  setUnits: (units: Units) => void;
  
  // Location
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  recentLocations: Location[];
  addRecentLocation: (location: Location) => void;
  clearRecentLocations: () => void;
  
  // UI State
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const MAX_RECENT_LOCATIONS = 5;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User Preferences
      units: {
        temperature: 'celsius',
        windSpeed: 'kmh',
        precipitation: 'mm',
      },
      setUnits: (units) => set({ units }),
      
      // Location
      currentLocation: null,
      setCurrentLocation: (currentLocation) => set({ currentLocation }),
      recentLocations: [],
      addRecentLocation: (location) => 
        set((state) => {
          const filtered = state.recentLocations.filter(l => l.id !== location.id);
          return {
            recentLocations: [location, ...filtered].slice(0, MAX_RECENT_LOCATIONS),
          };
        }),
      clearRecentLocations: () => set({ recentLocations: [] }),
      
      // UI State
      selectedDay: 0,
      setSelectedDay: (selectedDay) => set({ selectedDay }),
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({
        units: state.units,
        recentLocations: state.recentLocations,
      }),
    }
  )
);