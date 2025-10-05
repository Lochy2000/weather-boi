import { useEffect, useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Toast } from '../ui/toast';

export function InstallPWA() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Don't show toast if already installed or not installable
    if (isInstalled || !isInstallable) {
      return;
    }

    // Show toast after 10 seconds
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    await installApp();
    setShowToast(false);
  };

  const handleDismiss = () => {
    setShowToast(false);
  };

  return (
    <Toast
      open={showToast}
      onOpenChange={setShowToast}
      title="Install Weather App"
      description="Get quick access to weather updates. Install our app for a better experience!"
      action={{
        label: 'Install',
        onClick: handleInstall,
      }}
    />
  );
}
