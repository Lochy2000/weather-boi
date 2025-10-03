import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useFavoritesStore } from '../../stores/favorites.store';
import { Location } from '../../types';

interface SaveLocationButtonProps {
  location: Location;
}

export function SaveLocationButton({ location }: SaveLocationButtonProps) {
  const { favorites, addFavorite, removeFavorite, isFavorite, getFavorite } = useFavoritesStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isCurrentlyFavorite = isFavorite(location.id);
  const favorite = getFavorite(location.id);
  const isMaxReached = favorites.length >= 10;

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite && favorite) {
      removeFavorite(favorite.id);
      showToastMessage('Removed from favorites');
    } else if (!isMaxReached) {
      addFavorite(location);
      showToastMessage('Added to favorites');
    } else {
      showToastMessage('Maximum 10 favorites reached');
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        disabled={!isCurrentlyFavorite && isMaxReached}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all
          ${isCurrentlyFavorite
            ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/30'
            : isMaxReached
            ? 'bg-neutral-800 border border-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-750 hover:border-yellow-500 hover:text-yellow-500'
          }
        `}
        aria-label={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={`w-4 h-4 ${isCurrentlyFavorite ? 'fill-yellow-500' : ''}`}
        />
        <span className="text-sm font-medium hidden sm:inline">
          {isCurrentlyFavorite ? 'Saved' : 'Save Location'}
        </span>
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 shadow-lg">
            <p className="text-sm text-neutral-0 flex items-center gap-2">
              <Star className={`w-4 h-4 ${isCurrentlyFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-400'}`} />
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
