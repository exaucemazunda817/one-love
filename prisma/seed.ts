import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Crée le tout premier compte DIRECTION du logiciel de gestion. À exécuter à
// la main, une seule fois, PAR MAZUNDA — jamais automatiquement au
// déploiement, et jamais par Claude avec un vrai mot de passe : aucun mot de
// passe destiné à un usage réel ne doit transiter par une conversation, même
// pour un compte de test.
//
// Utilisation, dans le terminal de Mazunda :
//   SEED_DIRECTION_EMAIL="..." SEED_DIRECTION_PASSWORD="..." npm run db:seed
async function main() {
  const email = process.env.SEED_DIRECTION_EMAIL;
  const password = process.env.SEED_DIRECTION_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SEED_DIRECTION_EMAIL et SEED_DIRECTION_PASSWORD doivent être définis avant d'exécuter ce script, par exemple :\n" +
        '  SEED_DIRECTION_EMAIL="vous@exemple.org" SEED_DIRECTION_PASSWORD="un mot de passe fort" npm run db:seed'
    );
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

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
