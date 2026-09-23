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
  projectSlug: z.string().trim().max(80).optional().or(z.literal('')),
  donorEmail: email.optional().or(z.literal(''))
});

export type ContactInput = z.infer<typeof contactSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type DonationSessionInput = z.infer<typeof donationSessionSchema>;
