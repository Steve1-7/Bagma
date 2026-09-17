export function notifyWhatsApp(kind: 'order' | 'ticket' | 'carwash', details: Record<string, string | number | null>) {
  return fetch('/api/notifications/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, details }),
  }).catch(() => undefined);
}
