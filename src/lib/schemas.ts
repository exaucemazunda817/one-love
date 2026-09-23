import { z } from 'zod';

// Schémas de validation communs aux formulaires publics. Les limites de
// longueur ne sont pas arbitraires : elles bornent aussi la taille d'un envoi
// abusif, en plus du rate limiting.

const name = z.string().trim().min(1, 'Champ requis.').max(120);
const email = z.string().trim().toLowerCase().email('Adresse e-mail invalide.').max(180);
const phone = z.string().trim().max(40).optional().or(z.literal(''));
const longText = (min: number, max: number) =>
  z.string().trim().min(min, `Merci d'écrire au moins ${min} caractères.`).max(max);

export const contactSchema = z.object({
  fullName: name,
  email,
  phone,
  subject: z.string().trim().min(1, 'Champ requis.').max(140),
  message: longText(10, 4000)
});

export const volunteerSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone,
  country: z.string().trim().max(80).optional().or(z.literal('')),
  availability: z.string().trim().max(200).optional().or(z.literal('')),
  skills: z.string().trim().max(600).optional().or(z.literal('')),
  motivation: longText(20, 3000)
});

export const partnershipSchema = z.object({
  organisationName: name,
  contactName: name,
  email,
  phone,
  // Un site vide ("") est accepté ; un site renseigné doit être une vraie URL
  // http(s), pas un javascript: ou un data:.
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^https?:\/\//i.test(value), 'Lien invalide.'),
  partnershipType: z.string().trim().max(120).optional().or(z.literal('')),
  message: longText(20, 3000)
});

export const newsletterSchema = z.object({
  email,
  firstName: z.string().trim().max(120).optional().or(z.literal(''))
});

export const donationSessionSchema = z.object({
  // Montant en euros, saisi par le visiteur : borné à un intervalle large
  // mais fini pour écarter une faute de frappe (ex. 100000 € au lieu de
  // 100 €) et un envoi abusif automatisé.
  amountEur: z.number().finite().min(1, 'Le don minimum est de 1 €.').max(100000, 'Montant trop élevé — contactez-nous directement.'),
  // Choix du donateur entre un don unique et un engagement mensuel récurrent.
  frequency: z.enum(['once', 'monthly']).default('once'),
  projectSlug: z.string().trim().max(80).optional().or(z.literal('')),
  donorEmail: email.optional().or(z.literal(''))
});

export type ContactInput = z.infer<typeof contactSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type DonationSessionInput = z.infer<typeof donationSessionSchema>;

// --- Comptabilité (jalon 6) --------------------------------------------
//
// Les montants sont des CHAÎNES validées par motif, jamais des `number` : un
// écriture comptable doit garder la précision exacte saisie (surtout pour de
// gros montants en francs congolais), sans passer par l'arrondi flottant de
// JavaScript. La chaîne est transmise telle quelle à Prisma, qui la stocke
// dans une colonne Decimal.
const decimalString = (maxIntDigits: number, maxDecimals: number) =>
  z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{1,${maxIntDigits}}(\\.\\d{1,${maxDecimals}})?$`),
      'Montant invalide (chiffres et point décimal uniquement).'
    );

const optionalId = z.string().trim().max(40).optional().or(z.literal(''));

export const financialAccountSchema = z.object({
  name: z.string().trim().min(1, 'Champ requis.').max(120),
  currency: z.enum(['EUR', 'CDF', 'USD']),
  kind: z.enum(['BANK', 'CASH', 'MOBILE_MONEY']),
  bankName: z.string().trim().max(120).optional().or(z.literal('')),
  ibanLast4: z
    .string()
    .trim()
    .max(4)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^\d{4}$/.test(v), 'Quatre chiffres exactement.')
});

export const transactionCategorySchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9_]+$/, 'Lettres majuscules, chiffres et underscores uniquement.'),
  label: z.string().trim().min(1, 'Champ requis.').max(120),
  kind: z.enum(['INCOME', 'EXPENSE']),
  parentId: optionalId
});

// `refine` impose le taux de change dès que la devise n'est pas l'euro — pas
// de valeur par défaut silencieuse, le taux réel doit toujours être saisi à
// la main par la personne qui enregistre l'écriture.
export const transactionEntrySchema = z
  .object({
    kind: z.enum(['INCOME', 'EXPENSE']),
    occurredOn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Date invalide.'),
    label: z.string().trim().min(1, 'Champ requis.').max(200),
    description: z.string().trim().max(2000).optional().or(z.literal('')),
    amount: decimalString(15, 2),
    currency: z.enum(['EUR', 'CDF', 'USD']),
    fxRate: decimalString(10, 8).optional().or(z.literal('')),
    accountId: optionalId,
    categoryId: optionalId,
    projectId: optionalId
  })
  .refine((data) => data.currency === 'EUR' || (data.fxRate && Number(data.fxRate) > 0), {
    message: "Le taux de change est requis pour une devise autre que l'euro.",
    path: ['fxRate']
  });

export type FinancialAccountInput = z.infer<typeof financialAccountSchema>;
export type TransactionCategoryInput = z.infer<typeof transactionCategorySchema>;
export type TransactionEntryInput = z.infer<typeof transactionEntrySchema>;

// --- Bénéficiaires (jalon 7) ---------------------------------------------
//
// Aucun champ de texte libre au-delà de ce que le schéma Prisma autorise
// déjà : ne jamais ajouter ici un champ « notes » ou « description » sur un
// enfant, même si une future demande semble raisonnable — voir le
// commentaire du modèle Child dans schema.prisma.

export const childSchema = z.object({
  firstName: z.string().trim().min(1, 'Champ requis.').max(80),
  lastNameInitial: z
    .string()
    .trim()
    .max(1)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^[A-Za-zÀ-ÿ]$/.test(v), 'Une seule lettre.'),
  sex: z.enum(['F', 'M', '']).optional(),
  birthYear: z
    .number()
    .int()
    .min(new Date().getFullYear() - 25)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  estimatedAge: z.number().int().min(0).max(25).optional().nullable(),
  neighbourhood: z.string().trim().max(80).optional().or(z.literal('')),
  firstContactOn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Date invalide.'),
  referentId: z.string().trim().max(40).optional().or(z.literal(''))
});

export const careEventSchema = z.object({
  kind: z.enum([
    'MEAL',
    'HYGIENE',
    'MEDICAL_CONSULTATION',
    'VACCINATION',
    'PSYCHOSOCIAL_INTERVIEW',
    'WORKSHOP',
    'SCHOOLING',
    'OTHER'
  ]),
  occurredOn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Date invalide.'),
  providerName: z.string().trim().max(120).optional().or(z.literal('')),
  costAmount: z.string().trim().max(20).optional().or(z.literal('')),
  costCurrency: z.enum(['EUR', 'CDF', 'USD']).optional()
});

export const childEnrollmentSchema = z.object({
  projectId: z.string().trim().min(1, 'Projet requis.').max(40),
  enrolledOn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Date invalide.')
});

export const mediaConsentSchema = z.object({
  scope: z.enum(['WEBSITE', 'SOCIAL_MEDIA', 'DONOR_REPORTS', 'INTERNAL_ONLY']),
  status: z.enum(['GRANTED', 'REFUSED', 'WITHDRAWN', 'NOT_COLLECTED']),
  signedByName: z.string().trim().max(120).optional().or(z.literal('')),
  signedByRole: z.string().trim().max(80).optional().or(z.literal('')),
  signedOn: z.string().optional().or(z.literal(''))
});

export type ChildInput = z.infer<typeof childSchema>;
export type CareEventInput = z.infer<typeof careEventSchema>;
export type ChildEnrollmentInput = z.infer<typeof childEnrollmentSchema>;
export type MediaConsentInput = z.infer<typeof mediaConsentSchema>;
