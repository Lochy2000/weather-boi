import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function InstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    await installApp();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Download className="hidden sm:block flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">
                Install Weather App
              </p>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
                Get quick access and offline support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 hover:bg-blue-600 rounded-md transition-colors"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
