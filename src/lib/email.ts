import { escapeHtml } from '@/lib/validation';

// Envoi d'e-mails via Resend, par appel HTTP direct — pas de SDK, donc zéro
// dépendance supplémentaire et zéro surprise au moment du déploiement.
//
// Tant que RESEND_API_KEY et EMAIL_FROM ne sont pas définis, rien n'est
// envoyé et l'appelant en est informé explicitement. C'est volontaire : un
// envoi qui échoue en silence est pire que pas d'envoi du tout.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const TIMEOUT_MS = 8000;

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'invalid-address' | 'failed' };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  if (!isEmailConfigured()) return { ok: false, reason: 'not-configured' };
  if (!looksLikeEmail(to)) return { ok: false, reason: 'invalid-address' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
        ...(replyTo && looksLikeEmail(replyTo) ? { reply_to: replyTo } : {})
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.error('Resend a refusé l’envoi', response.status, await response.text());
      return { ok: false, reason: 'failed' };
    }
    return { ok: true };
  } catch (error) {
    console.error('Envoi d’e-mail impossible', error);
    return { ok: false, reason: 'failed' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Notification interne envoyée à l'association quand un visiteur remplit un
 * formulaire. Tout champ venant du visiteur passe par escapeHtml : les clients
 * de messagerie rendent le HTML, et sans ça un message de contact pourrait
 * injecter des liens dans l'e-mail reçu par l'association.
 */
export async function notifyAssociation({
  subject,
  lines,
  replyTo
}: {
  subject: string;
  lines: { label: string; value: string }[];
  replyTo?: string;
}): Promise<EmailResult> {
  const recipient = process.env.EMAIL_TO || process.env.EMAIL_FROM;
  if (!recipient) return { ok: false, reason: 'not-configured' };

  const text = lines.map(({ label, value }) => `${label} : ${value}`).join('\n');
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.6">${lines
    .map(
      ({ label, value }) =>
        `<p style="margin:0 0 10px"><strong>${escapeHtml(label)}</strong><br>${escapeHtml(
          value
        ).replace(/\n/g, '<br>')}</p>`
    )
    .join('')}</div>`;

  return sendEmail({ to: recipient, subject, text, html, replyTo });
}
