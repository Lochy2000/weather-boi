import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location } from '../types';

export interface FavoriteLocation {
  id: string;
  location: Location;
  nickname?: string;
  addedAt: Date;
  order: number;
}

interface FavoritesStore {
  favorites: FavoriteLocation[];
  addFavorite: (location: Location, nickname?: string) => void;
  removeFavorite: (id: string) => void;
  updateNickname: (id: string, nickname: string) => void;
  reorderFavorites: (startIndex: number, endIndex: number) => void;
  isFavorite: (locationId: number) => boolean;
  getFavorite: (locationId: number) => FavoriteLocation | undefined;
}

const MAX_FAVORITES = 10;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (location, nickname) => {
        const { favorites } = get();

        // Check if already a favorite
        if (favorites.some(fav => fav.location.id === location.id)) {
          return;
        }

        // Check max limit
        if (favorites.length >= MAX_FAVORITES) {
          console.warn(`Maximum of ${MAX_FAVORITES} favorites reached`);
          return;
        }

        const newFavorite: FavoriteLocation = {
          id: `fav-${location.id}-${Date.now()}`,
          location,
          nickname,
          addedAt: new Date(),
          order: favorites.length,
        };

        set({ favorites: [...favorites, newFavorite] });
      },

      removeFavorite: (id) => {
        const { favorites } = get();
        const filtered = favorites.filter(fav => fav.id !== id);

        // Reorder remaining favorites
        const reordered = filtered.map((fav, index) => ({
          ...fav,
          order: index,
        }));

        set({ favorites: reordered });
      },

      updateNickname: (id, nickname) => {
        const { favorites } = get();
        const updated = favorites.map(fav =>
          fav.id === id ? { ...fav, nickname } : fav
        );
        set({ favorites: updated });
      },

      reorderFavorites: (startIndex, endIndex) => {
        const { favorites } = get();
        const result = Array.from(favorites);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        // Update order values
        const reordered = result.map((fav, index) => ({
          ...fav,
          order: index,
        }));

        set({ favorites: reordered });
      },

      isFavorite: (locationId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.location.id === locationId);
      },

      getFavorite: (locationId) => {
        const { favorites } = get();
        return favorites.find(fav => fav.location.id === locationId);
      },
    }),
    {
      name: 'weather-favorites-storage',
      // Custom serialization for Date objects
      partialize: (state) => ({
        favorites: state.favorites.map(fav => ({
          ...fav,
          addedAt: fav.addedAt.toISOString(),
        })),
      }),
      // Custom deserialization for Date objects
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.favorites = state.favorites.map(fav => ({
            ...fav,
            addedAt: new Date(fav.addedAt),
          }));
        }
      },
    }
  )
);
