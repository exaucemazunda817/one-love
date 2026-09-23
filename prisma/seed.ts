import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Crée le tout premier compte DIRECTION du logiciel de gestion. À exécuter à
 * la main PAR MAZUNDA — jamais automatiquement au déploiement, et jamais par
 * Claude avec un vrai mot de passe : aucun mot de passe destiné à un usage
 * réel ne doit transiter par une conversation, même pour un compte de test.
 *
 * Sans les deux variables d'environnement, cette étape est silencieusement
 * ignorée (pas une erreur) : `npm run db:seed` doit rester exécutable sans
 * secret pour la seule partie ci-dessous (`seedReferenceData`).
 *
 *   SEED_DIRECTION_EMAIL="vous@exemple.org" SEED_DIRECTION_PASSWORD="un mot de passe fort" npm run db:seed
 */
async function seedDirectionAccount() {
  const email = process.env.SEED_DIRECTION_EMAIL;
  const password = process.env.SEED_DIRECTION_PASSWORD;

  if (!email || !password) {
    console.log(
      'SEED_DIRECTION_EMAIL / SEED_DIRECTION_PASSWORD absents — compte DIRECTION non créé (normal si ce n’est pas le but de cet appel).'
    );
    return;
  }
  if (password.length < 12) {
    throw new Error('SEED_DIRECTION_PASSWORD doit compter au moins 12 caractères.');
  }

  const existing = await prisma.appUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Un compte existe déjà pour ${email} — rien à faire.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.appUser.create({
    data: {
      email,
      passwordHash,
      firstName: 'Direction',
      lastName: 'One Love',
      role: 'DIRECTION',
      mustChangePassword: true
    }
  });

  console.log(
    `Compte DIRECTION créé : ${user.email} (id ${user.id}). Le changement de mot de passe sera exigé dès la première connexion sur /gestion/connexion.`
  );
}

/**
 * Données de référence PUBLIQUES, sans secret : le projet RÊVES 2, avec le
 * contenu déjà vérifié de src/lib/content.ts (`currentProject`), rien
 * d'inventé. Idempotent, sans risque à rejouer.
 *
 * Corrige un vrai manque découvert au jalon 6 : la table `projects` était
 * vide depuis le début du projet, donc tout don fléché vers RÊVES 2
 * (`projectSlug`) perdait silencieusement son rattachement depuis le
 * jalon 4 — sans cette ligne, le bilan par projet reste toujours vide.
 */
async function seedReferenceData() {
  const existing = await prisma.project.findUnique({ where: { slug: 'reves-2' } });
  if (existing) {
    console.log('Le projet reves-2 existe déjà — rien à faire.');
    return;
  }

  const project = await prisma.project.create({
    data: {
      slug: 'reves-2',
      name: 'RÊVES 2',
      acronymMeaning: 'Réaménager – Éduquer – Valoriser – Écouter – Soigner',
      summary:
        "Lancé une première fois l'année dernière, le projet RÊVES revient avec une deuxième phase, davantage axée sur l'éducation, en partenariat avec Angel Foundation.",
      content:
        "Sur une période de 4 mois (septembre à décembre), RÊVES 2 propose aux enfants de One Love un accompagnement structuré combinant alphabétisation, apprentissage du français, activités culturelles, sportives et artistiques. Le projet comprend également la formation des animateurs, le renforcement des ressources pédagogiques et la mise à disposition de matériel informatique. Il intègre aussi un suivi médical et psychosocial régulier pour les enfants.",
      startsOn: new Date('2026-09-05'),
      endsOn: new Date('2026-12-31'),
      status: 'ACTIVE',
      publication: 'PUBLISHED',
      partnerName: 'Angel Foundation',
      // budgetEur volontairement absent : aucun chiffre vérifié disponible
      // (voir le commentaire [À COMPLÉTER] dans content.ts).
      isDonationTarget: true,
      displayOrder: 0
    }
  });

  console.log('Projet créé :', project.id, project.slug);
}

async function main() {
  await seedReferenceData();
  await seedDirectionAccount();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
