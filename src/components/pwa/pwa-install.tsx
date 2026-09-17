'use client';

import { Download, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export default function PwaInstall() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    return !standalone && window.localStorage.getItem('bagma-install-dismissed') !== 'true';
  });
  const [ios] = useState(() => typeof navigator !== 'undefined' && (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)));

  useEffect(() => {

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      setShow(true);
    };
    const handleInstalled = () => {
      setShow(false);
      setInstallEvent(null);
      window.localStorage.setItem('bagma-install-dismissed', 'true');
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!show || (!installEvent && !ios)) return null;

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setShow(false);
    setInstallEvent(null);
  }

  function dismiss() {
    setShow(false);
    window.localStorage.setItem('bagma-install-dismissed', 'true');
  }

  return (
    <aside className="fixed bottom-20 left-4 right-4 z-40 border border-gold/40 bg-charcoal p-4 text-white shadow-2xl md:bottom-6 md:left-auto md:max-w-sm" role="dialog" aria-label="Install Bagma">
      <button type="button" onClick={dismiss} aria-label="Dismiss install message" className="absolute right-3 top-3 text-white/50 hover:text-white"><X className="h-4 w-4" /></button>
      <p className="pr-6 text-xs font-bold uppercase tracking-[0.22em] text-gold">Take Bagma with you</p>
      <p className="mt-2 text-sm text-white/70">{ios ? <><Share className="mr-1 inline h-4 w-4 text-gold" />Open Bagma in Safari, tap Share, choose <strong className="text-white">Add to Home Screen</strong>, then tap Add.</> : 'Install Bagma for quick access to food, bookings and the latest events.'}</p>
      {installEvent && <button type="button" onClick={install} className="mt-4 inline-flex items-center bg-red px-4 py-2.5 text-sm font-bold text-white hover:bg-red/90 focus:outline-none focus:ring-2 focus:ring-gold"><Download className="mr-2 h-4 w-4" />Install Bagma</button>}
    </aside>
  );
}