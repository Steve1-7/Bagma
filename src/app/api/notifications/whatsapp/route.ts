import { NextResponse } from 'next/server';

const recipients = ['27660290449', '27676283210'];

type NotificationBody = {
  kind: 'order' | 'ticket' | 'carwash';
  details: Record<string, string | number | null>;
};

function formatMessage({ kind, details }: NotificationBody) {
  const title = kind === 'order' ? 'New food order' : kind === 'ticket' ? 'New event ticket request' : 'New carwash booking';
  return [
    `Bagma Lifestyle: ${title}`,
    ...Object.entries(details).map(([key, value]) => `${key}: ${value ?? 'N/A'}`),
  ].join('\n');
}

export async function POST(request: Request) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return NextResponse.json({ delivered: false, reason: 'WhatsApp credentials are not configured.' }, { status: 202 });
  }

  let body: NotificationBody;
  try {
    body = await request.json() as NotificationBody;
    if (!['order', 'ticket', 'carwash'].includes(body.kind) || !body.details) throw new Error('Invalid notification payload.');
  } catch {
    return NextResponse.json({ error: 'Invalid notification payload.' }, { status: 400 });
  }

  const message = formatMessage(body);
  const results = await Promise.allSettled(recipients.map((to) => fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } }),
  })));

  const delivered = results.filter((result) => result.status === 'fulfilled' && result.value.ok).length;
  return NextResponse.json({ delivered: delivered === recipients.length, deliveredTo: delivered });
}
