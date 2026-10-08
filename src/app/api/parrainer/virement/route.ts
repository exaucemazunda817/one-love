import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { sponsorSessionSchema } from '@/lib/sponsorship';
import { createSponsorTransferRequest } from '@/lib/bank-transfer';

// Parrainage par virement permanent (08/10/2026). La personne n'est PAS
// encore parrain : elle est enregistrée « en attente du premier virement »
// avec une référence unique. Elle devient parrain quand l'équipe clique
// « Virement reçu » dans /gestion/virements (règle du 29/09/2026 : sans
// paiement confirmé, personne ne devient parrain).
export async function POST(request: NextRequest) {
  if (!(await allowRequest('parrainer-virement', request, 10, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sponsorSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const { reference } = await createSponsorTransferRequest(parsed.data);
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error('Demande de parrainage par virement non enregistrée', error);
    return NextResponse.json({ error: 'Une erreur est survenue. Merci de réessayer.' }, { status: 500 });
  }
}
