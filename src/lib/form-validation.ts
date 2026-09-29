import type { Locale } from '@/lib/i18n';

// Validation côté navigateur des formulaires publics. Les formulaires ont
// `noValidate` (pour garder nos propres messages) : sans ce fichier, un champ
// vide ou une adresse invalide partait au serveur, qui répondait seulement
// « Formulaire invalide. » sans dire quel champ (audit du 29/09/2026,
// WCAG 3.3.1 identification des erreurs). Le serveur reste juge : ces règles
// ne sont là que pour aider la personne et ne remplacent aucun contrôle serveur.

export type FieldRule = { required?: boolean; email?: boolean; min?: number };
export type FieldErrors = Record<string, string>;

const messages = {
  fr: {
    required: 'Ce champ est obligatoire.',
    email: "Cette adresse e-mail ne semble pas valide.",
    min: (n: number) => `Merci d'écrire au moins ${n} caractères.`,
    check: 'Merci de cocher cette case pour continuer.',
    server: 'Merci de vérifier ce champ.',
    amount: 'Le montant minimum est de 1 €.'
  },
  en: {
    required: 'This field is required.',
    email: "This email address doesn't look valid.",
    min: (n: number) => `Please write at least ${n} characters.`,
    check: 'Please tick this box to continue.',
    server: 'Please check this field.',
    amount: 'The minimum amount is €1.'
  }
} as const;

export function formMessages(locale: Locale) {
  return messages[locale];
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contrôle les champs nommés du formulaire ; renvoie les erreurs par nom de champ. */
export function validateFields(
  form: HTMLFormElement,
  rules: Record<string, FieldRule>,
  locale: Locale
): FieldErrors {
  const m = messages[locale];
  const data = new FormData(form);
  const errors: FieldErrors = {};
  for (const [name, rule] of Object.entries(rules)) {
    const value = String(data.get(name) ?? '').trim();
    if (rule.required && !value) errors[name] = m.required;
    else if (value && rule.email && !EMAIL.test(value)) errors[name] = m.email;
    else if (value && rule.min && value.length < rule.min) errors[name] = m.min(rule.min);
  }
  return errors;
}

/**
 * Convertit les erreurs renvoyées par le serveur (`issues`, par nom de champ
 * du schéma serveur) en erreurs par nom de champ du formulaire. Le texte du
 * serveur est en français : on affiche un message court dans la langue de la
 * page plutôt que de le recopier.
 */
export function serverIssuesToErrors(
  issues: unknown,
  map: Record<string, string>,
  locale: Locale
): FieldErrors {
  const errors: FieldErrors = {};
  if (!issues || typeof issues !== 'object') return errors;
  for (const key of Object.keys(issues as Record<string, unknown>)) {
    const field = map[key];
    if (field) errors[field] = messages[locale].server;
  }
  return errors;
}

/** Place le focus sur le premier champ en erreur, dans l'ordre de la page. */
export function focusFirstError(form: HTMLFormElement | null, errors: FieldErrors) {
  if (!form) return;
  const first = [...form.querySelectorAll<HTMLElement>('[name]')].find((el) => {
    const n = el.getAttribute('name');
    return n ? Boolean(errors[n]) : false;
  });
  first?.focus();
}
