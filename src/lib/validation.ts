// Garde-fous communs aux formulaires publics.

/** Bloque javascript: et data:, qui passent une validation d'URL naïve. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return isHttpUrl(trimmed) ? trimmed : null;
}

export function tooLong(value: string | null | undefined, max: number): boolean {
  return Boolean(value && value.length > max);
}

/**
 * Échappement HTML de tout champ saisi par un visiteur avant de l'insérer dans
 * un e-mail. Les clients de messagerie rendent le HTML : sans ça, un message
 * de contact peut injecter des liens dans l'e-mail reçu par l'association.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
