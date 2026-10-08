import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { donationSessionSchema } from '@/lib/schemas';
import { prisma } from '@/lib/prisma';
import { createTransferPledge } from '@/lib/bank-transfer';
import { VILLAGE_SLUG } from '@/lib/funds';

// Don par virement (08/10/2026). Aucun argent ne transite ici : on enregistre
// une promesse EN ATTENTE avec une référence unique que le donateur recopie
// dans le libellé de son virement. L'équipe la confirme dans
// /gestion/virements quand le virement apparaît sur le relevé.
export async function POST(request: NextRequest) {
  if (!(await allowRequest('dons-virement', request, 10, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = donationSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Même règle que pour la carte : un don fléché doit arriver dans son
  // projet, jamais en silence au fonds général.
  const project = data.projectSlug
    ? await prisma.project.findUnique({
        where: { slug: data.projectSlug },
        select: { id: true, isDonationTarget: true }
      })
    : null;
  if (data.projectSlug && (!project || !project.isDonationTarget)) {
    return NextResponse.json(
      { error: 'Ce projet ne reçoit pas de dons en ligne pour le moment. Merci de nous écrire.' },
      { status: 400 }
    );
  }

  try {
    const { reference } = await createTransferPledge({
      amount: data.amount,
      currency: data.currency,
      isRecurring: data.frequency === 'monthly',
      projectId: project?.id ?? null,
      kind: data.projectSlug === VILLAGE_SLUG ? 'VIL' : 'DON',
      donorEmail: data.donorEmail || null,
      donorFirstName: data.donorFirstName || null,
      donorLastName: data.donorLastName || null,
      donorCountry: data.donorCountry || null
    });
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error('Promesse de virement non enregistrée', error);
    return NextResponse.json({ error: 'Une erreur est survenue. Merci de réessayer.' }, { status: 500 });
  }
}
