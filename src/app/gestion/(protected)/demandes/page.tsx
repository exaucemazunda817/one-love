import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatFieldDateTime } from '@/lib/dates';
import { RequestsBoard, type RequestItem } from './RequestsBoard';

export const metadata: Metadata = {
  title: 'Demandes — Gestion',
  robots: { index: false, follow: false }
};

// Tout ce que le site public reçoit : messages de contact (dont les demandes
// de parrainage et d'alerte Mobile Money, qui passent par le même
// formulaire), candidatures bénévoles, propositions de partenariat. Jusqu'au
// 27/09/2026, le tableau de bord n'en affichait que des compteurs : une
// demande de parrainage pouvait n'être lue par personne.
const LIMIT = 200;

export default async function DemandesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (user.role !== 'DIRECTION') redirect('/gestion');

  const [messages, volunteers, partnerships] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: LIMIT }),
    prisma.volunteerApplication.findMany({ orderBy: { createdAt: 'desc' }, take: LIMIT }),
    prisma.partnershipRequest.findMany({ orderBy: { createdAt: 'desc' }, take: LIMIT })
  ]);

  const items: RequestItem[] = [
    ...messages.map((m) => ({
      id: m.id,
      type: 'messages' as const,
      status: m.status,
      receivedAt: formatFieldDateTime(m.createdAt),
      sortKey: m.createdAt.getTime(),
      title: m.subject,
      name: m.fullName,
      email: m.email,
      phone: m.phone,
      website: null,
      fields: [] as { label: string; value: string }[],
      body: m.message
    })),
    ...volunteers.map((v) => ({
      id: v.id,
      type: 'benevoles' as const,
      status: v.status,
      receivedAt: formatFieldDateTime(v.createdAt),
      sortKey: v.createdAt.getTime(),
      title: 'Candidature bénévole',
      name: `${v.firstName} ${v.lastName}`,
      email: v.email,
      phone: v.phone,
      website: null,
      fields: [
        { label: 'Pays', value: v.country ?? '' },
        { label: 'Disponibilités', value: v.availability ?? '' },
        { label: 'Compétences', value: v.skills ?? '' }
      ].filter((f) => f.value),
      body: v.motivation
    })),
    ...partnerships.map((p) => ({
      id: p.id,
      type: 'partenariats' as const,
      status: p.status,
      receivedAt: formatFieldDateTime(p.createdAt),
      sortKey: p.createdAt.getTime(),
      title: `Partenariat — ${p.organisationName}`,
      name: p.contactName,
      email: p.email,
      phone: p.phone,
      website: p.website,
      fields: [{ label: 'Type', value: p.partnershipType ?? '' }].filter((f) => f.value),
      body: p.message
    }))
  ].sort((a, b) => b.sortKey - a.sortKey);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Demandes reçues</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Messages, demandes de parrainage, candidatures bénévoles et propositions de partenariat envoyés
          depuis le site.
        </p>
      </div>
      <RequestsBoard initialItems={items} />
    </div>
  );
}
