import React, { useState } from 'react';
import { Star, MapPin, Trash2, Edit2, X, Check } from 'lucide-react';
import { useFavoritesStore } from '../../stores/favorites.store';
import { useAppStore } from '../../stores/app.store';

export function FavoritesDropdown() {
  const { favorites, removeFavorite, updateNickname } = useFavoritesStore();
  const { setCurrentLocation, addRecentLocation } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState('');

  const handleSelectFavorite = (favorite: any) => {
    setCurrentLocation(favorite.location);
    addRecentLocation(favorite.location);
    setIsOpen(false);
  };

  const handleStartEdit = (id: string, currentNickname?: string) => {
    setEditingId(id);
    setEditNickname(currentNickname || '');
  };

  const handleSaveEdit = (id: string) => {
    if (editNickname.trim()) {
      updateNickname(id, editNickname.trim());
    }
    setEditingId(null);
    setEditNickname('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNickname('');
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 hover:border-neutral-600 transition-all"
        aria-label="Favorites"
      >
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium text-neutral-0 hidden sm:inline">
          Favorites
        </span>
        <span className="text-xs text-neutral-400 bg-neutral-700 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {favorites.length}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-neutral-700">
              <h3 className="text-sm font-semibold text-neutral-0 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Saved Locations
              </h3>
            </div>

            <div className="divide-y divide-neutral-700">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-3 hover:bg-neutral-750 transition-colors"
                >
                  {editingId === favorite.id ? (
                    // Edit mode
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        placeholder="Enter nickname"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-600 rounded text-sm text-neutral-0 focus:outline-none focus:border-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(favorite.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(favorite.id)}
                          className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleSelectFavorite(favorite)}
                        className="flex-1 text-left group"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {favorite.nickname ? (
                              <>
                                <p className="text-sm font-medium text-neutral-0 group-hover:text-blue-400 transition-colors truncate">
                                  {favorite.nickname}
                                </p>
                                <p className="text-xs text-neutral-400 truncate">
                                  {favorite.location.name}, {favorite.location.country}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-medium text-neutral-0 group-hover:text-blue-400 transition-colors truncate">
                                {favorite.location.name}, {favorite.location.country}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(favorite.id, favorite.nickname)}
                          className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-blue-400 transition-colors"
                          aria-label="Edit nickname"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleRemove(e, favorite.id)}
                          className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-red-400 transition-colors"
                          aria-label="Remove favorite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {favorites.length >= 10 && (
              <div className="p-3 border-t border-neutral-700 bg-neutral-900/50">
                <p className="text-xs text-neutral-400 text-center">
                  Maximum 10 locations saved
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
