// Contenu réel de l'association, centralisé ici.
//
// Sources, toutes vérifiées le 23/09/2026 :
//   - associationonelove.org (pages d'accueil et « Faire un don ») ;
//   - le contenu déjà rédigé et validé dans gospel-nation/src/lib/content.ts,
//     lui-même sourcé le 13/09/2026 sur le site et la page Facebook.
//
// RÈGLE DU PROJET : tout ce qui n'est pas vérifié reste suffixé `Placeholder`
// et marqué [À COMPLÉTER]. C'est une vraie association, avec de vrais
// donateurs et de vrais enfants : on ne transforme jamais un texte provisoire
// en contenu définitif sans confirmation explicite.

export const org = {
  name: 'One Love',
  legalName: 'Association One Love',
  tagline: "L'amour et la foi, notre carburant.",
  /// Numéro au Répertoire National des Associations.
  rna: 'W951001528',
  foundedYear: 2010,
  founders: 'Kanda Kabangu et son épouse',

  // ATTENTION — contradiction non résolue, à trancher AVANT de publier les
  // mentions légales : le site actuel annonce le 44 rue de la Roquette à
  // Paris 11e, tandis qu'une base officielle indique un siège à
  // Châtenay-Malabry. Demander la dernière déclaration en préfecture.
  addressAsPublished: '44 rue de la Roquette, 75011 Paris',
  addressNeedsConfirmation: true,

  contactEmail: 'contact@associationonelove.org',
  /// Adresse historiquement indiquée pour les demandes d'accès aux données.
  privacyEmail: 'associationonelove@gmail.com',

  websiteUrl: 'https://associationonelove.org',
  facebookUrl: 'https://www.facebook.com/associationonelove',
  facebookReelsUrl: 'https://www.facebook.com/associationonelove/reels_tab'
} as const;

export const quotes = {
  hero: "Notre désir est de communiquer l'amour que nous avons reçu.",
  need: 'Chaque être humain a besoin de se sentir aimé et désiré.',
  actions:
    "L'amour que nous souhaitons transmettre est une prolongation de nos valeurs : ce n'est pas pour détruire mais pour construire, non pour imposer mais pour démontrer par nos actes d'amour que l'Homme est aimé au-delà des frontières, des cultures ou des religions."
} as const;

export const identity = {
  vision:
    "L'amour est un besoin fondamental de l'être humain. Toute personne victime d'exclusion devrait pouvoir satisfaire ce besoin d'être aimée.",
  mission:
    'Réaliser des projets en République Démocratique du Congo qui ont pour objet de valoriser les populations marginalisées, en particulier les enfants.',
  objectifs: [
    "Permettre l'accès à un mode de vie décent par l'éducation et des actions sociales et sanitaires.",
    'Co-construire des programmes de (ré)insertion professionnelle.',
    'Accompagner les bénéficiaires dans leur accomplissement professionnel et/ou personnel.'
  ],
  valeurs: [
    "Aimer l'autre comme soi-même.",
    "Croire à l'impossible.",
    'Conduire nos actions dans le respect de l’environnement.'
  ]
} as const;

/// Les trois piliers affichés sous « Qu'est-ce que One Love ? ».
export const pillars = [
  {
    title: "L'amour avant tout",
    body: "C'est notre carburant, ce qui nous anime et nous pousse à agir. Nous sommes aimés et nous souhaitons aimer en retour."
  },
  {
    title: 'Des personnes engagées',
    body: 'Nous sommes une équipe jeune et dynamique avec le désir de faire une différence dans ce monde.'
  },
  {
    title: 'Des rêves en action',
    body: "Chacun a un rêve sur son cœur, nous agissons ensemble pour le rendre réel."
  }
] as const;

/// Mot des fondateurs, repris tel quel du site.
export const foundersWord = {
  author: 'Kanda Kabangu',
  body: "Depuis que nous nous sommes rencontrés en 2010, ma femme et moi avons eu à cœur de vivre un rêve commun : aimer et aider ceux qui en ont besoin."
} as const;

export const teamWord =
  "Nous sommes une équipe dynamique et pleine d'enthousiasme, passionnée par le défi de rendre le monde meilleur. Et nous ne ménageons pas nos efforts pour y arriver.";

/// Projet en cours. Alimentera la table Project au jalon 1.
export const currentProject = {
  slug: 'reves-2',
  name: 'RÊVES 2',
  acronymMeaning: 'Réaménager – Éduquer – Valoriser – Écouter – Soigner',
  partnerName: 'Angel Foundation',
  period: 'Septembre à décembre 2026 (4 mois)',
  intro:
    "Lancé une première fois l'année dernière, le projet RÊVES revient avec une deuxième phase, davantage axée sur l'éducation, en partenariat avec Angel Foundation.",
  description:
    "Sur une période de 4 mois (septembre à décembre), RÊVES 2 propose aux enfants de One Love un accompagnement structuré combinant alphabétisation, apprentissage du français, activités culturelles, sportives et artistiques. Le projet comprend également la formation des animateurs, le renforcement des ressources pédagogiques et la mise à disposition de matériel informatique. Il intègre aussi un suivi médical et psychosocial régulier pour les enfants.",
  objectif: "Renforcer les compétences, la confiance et l'autonomie des enfants.",
  firstMilestone: {
    label: "Premiers pas dans l'alphabétisation",
    date: 'Samedi 5 septembre 2026'
  },
  // [À COMPLÉTER] Budget et calendrier détaillés, convention Angel Foundation.
  budgetEurPlaceholder: null
} as const;

/// Photos du projet RÊVES 2, à copier depuis gospel-nation/public/departments/
/// one-love/ au jalon 1.
///
/// AVANT PUBLICATION : vérifier le consentement à l'image. Ces photos étaient
/// déjà diffusées, mais rien ne documente d'autorisation signée des
/// représentants légaux. Voir la section RGPD du plan — la recommandation est
/// de ne pas les reprendre telles quelles sans consentement recueilli.
export const gallery = [
  {
    src: '/projets/reves-2/annonce.jpg',
    caption: "Premiers pas dans l'alphabétisation — samedi 5 septembre 2026, lancement du programme RÊVES 2."
  },
  {
    src: '/projets/reves-2/arrivee.jpg',
    caption: 'Les enfants arrivent au centre One Love, prêts à découvrir et apprendre.'
  },
  {
    src: '/projets/reves-2/formateurs.jpg',
    caption: 'Les formateurs du programme RÊVES 2, mobilisés pour encadrer les enfants.'
  },
  {
    src: '/projets/reves-2/atelier-1.jpg',
    caption: 'Atelier de coloriage et de lecture en petits groupes.'
  },
  {
    src: '/projets/reves-2/atelier-2.jpg',
    caption: 'Deux enfants dessinent ensemble pendant une activité artistique.'
  }
] as const;

/// Moyens de don. Le virement bancaire existe déjà et son RIB est publié par
/// l'association elle-même sur le site actuel ; Stripe et Mobile Money
/// arriveront au jalon 4.
///
/// [À COMPLÉTER] IBAN à reprendre de la page actuelle une fois confirmé qu'il
/// est toujours valide, et opérateur Mobile Money à obtenir.
export const donationNotice = {
  allocation:
    "Sauf mention spéciale, l'affectation de vos dons se fait en fonction des besoins des programmes de terrain. Si vous souhaitez soutenir un programme en particulier, précisez-le lors de votre virement.",
  privacy:
    "One Love ne commercialise pas ses fichiers de donateurs, de clients ni d'abonnés.",
  // Volontairement absent : aucune promesse de reçu fiscal tant que
  // l'habilitation de l'association n'est pas confirmée par un rescrit.
  taxReceiptClaim: null
} as const;

/// [À COMPLÉTER] Histoire détaillée de l'association, gouvernance (bureau,
/// conseil d'administration), chiffres d'activité, partenaires. Rien de tout
/// cela ne figure sur le site actuel.
export const historyPlaceholder = '[À COMPLÉTER]';
export const governancePlaceholder = '[À COMPLÉTER]';
