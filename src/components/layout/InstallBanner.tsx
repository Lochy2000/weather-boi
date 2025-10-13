import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function InstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  // Don't show footer if already installed
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (!isInstallable) {
      // If not installable via PWA API, show a helpful message
      alert('To install this app:\n\n' +
        '• Chrome/Edge: Use the install icon in the address bar\n' +
        '• iOS Safari: Tap Share → Add to Home Screen\n' +
        '• Firefox/Other: Check your browser menu for install options');
      return;
    }
    await installApp();
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>Download the app for quick access</span>
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            <Download size={16} />
            Install
          </button>
        </div>
      </div>
    </footer>
  );
}
