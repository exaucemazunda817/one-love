import { escapeHtml } from '@/lib/validation';
import { CONTACT_EMAIL } from '@/lib/i18n';
import { org } from '@/lib/content';

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


// Habillage commun des e-mails HTML (29/10/2026) : bandeau noir avec le logo
// de l'association (écriture claire sur fond noir, lisible en mode clair comme
// en mode sombre), contenu sur fond blanc, pied de page légal. Mise en
// page en tableaux et styles en ligne : c'est ce que les messageries acceptent.
// L'image est servie par le site lui-même (public/email/logo-one-love.png,
// 440 px de large pour un affichage à 220 px, net sur écran Retina).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associationonelove.org').replace(/\/$/, '');

function wrapHtml(inner: string): string {
  const font = "Georgia,'Times New Roman',serif";
  const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(org.name)}</title></head>
<body style="margin:0;padding:0;background:#f4efe8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4efe8;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td align="center" bgcolor="#0a0a0a" style="background:#0a0a0a;padding:20px 24px;">
<a href="${SITE_URL}" style="text-decoration:none;"><img src="${SITE_URL}/email/logo-one-love.png" width="220" alt="${escapeHtml(org.name)}" style="display:block;border:0;width:220px;max-width:100%;height:auto;"></a>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:#c2651a;">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px;font-family:${font};font-size:16px;line-height:1.6;color:#1e1a16;">${inner}</td></tr>
<tr><td style="padding:20px 28px 28px;font-family:${sans};font-size:12px;line-height:1.5;color:#6b6258;border-top:1px solid #eee6da;">
${escapeHtml(org.name)} · association loi 1901 · RNA ${escapeHtml(org.rna)}<br>${escapeHtml(org.addressAsPublished)}<br>
<a href="${SITE_URL}" style="color:#a9531a;">${SITE_URL.replace(/^https?:\/\//, '')}</a>
</td></tr>
</table></td></tr></table></body></html>`;
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
        html: wrapHtml(html),
        // Sans adresse de réponse précisée, les réponses vont à la vraie boîte de
        // l'association : l'adresse d'envoi (send.associationonelove.org) n'a
        // pas de boîte de réception, une réponse y serait perdue (28/10/2026).
        reply_to: replyTo && looksLikeEmail(replyTo) ? replyTo : CONTACT_EMAIL
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
