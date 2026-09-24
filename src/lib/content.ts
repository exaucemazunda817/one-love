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
  foundedYear: 2013,
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

  facebookUrl: 'https://www.facebook.com/associationonelove',
  facebookReelsUrl: 'https://www.facebook.com/associationonelove/reels_tab'
} as const;

// Décision de Mazunda (23/09/2026) : le nouveau site ne fait AUCUNE référence
// à l'ancien WordPress — ni lien, ni mention « site en construction »,
// ni « ancien site ». C'est un site neuf, il se présente comme tel.

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

/// Domaines d'intervention. Tous tirés de la description vérifiée de RÊVES 2
/// et des objectifs statutaires — rien d'inventé.
export const actions = [
  {
    title: 'Alphabétisation',
    body: "Apprendre à lire et à écrire est le premier levier d'autonomie. C'est par là qu'a commencé RÊVES 2, le 5 septembre 2026."
  },
  {
    title: 'Apprentissage du français',
    body: "Maîtriser la langue de scolarisation conditionne l'accès à l'école et, plus tard, à une formation professionnelle."
  },
  {
    title: 'Activités culturelles, sportives et artistiques',
    body: 'Le jeu, le sport et la création ne sont pas des à-côtés : ils rendent la confiance et réapprennent la vie en groupe.'
  },
  {
    title: 'Suivi médical et psychosocial',
    body: "Un accompagnement régulier, assuré avec des professionnels de santé. Les dossiers de soin restent chez les soignants."
  },
  {
    title: 'Formation des animateurs',
    body: "Former celles et ceux qui encadrent les enfants au quotidien, et renforcer les ressources pédagogiques du centre."
  },
  {
    title: '(Ré)insertion professionnelle',
    body: 'Co-construire des parcours qui mènent à un métier, et accompagner chacun jusque dans son accomplissement.'
  }
] as const;

/// Photos du projet RÊVES 2.
///
/// `publishable` est une décision documentée, pas une préférence esthétique.
/// L'association est française : les enfants photographiés sont des mineurs
/// vulnérables et aucun consentement à l'image signé n'est documenté à ce jour.
///
/// Sont publiées uniquement les images NON IDENTIFIANTES (visages non
/// visibles) et les supports de communication que l'association a elle-même
/// diffusés avec ses logos. Les portraits d'enfants reconnaissables restent
/// `publishable: false` tant que Mazunda n'a pas confirmé que les
/// consentements ont été recueillis.
///
/// DEUX VERROUS, pas un seul :
///   1. les pages ne rendent que `publishableGallery`, jamais `gallery` ;
///   2. surtout, les fichiers non publiables ne sont PAS dans `public/`.
///      Tout fichier placé dans `public/` est servi à qui en connaît l'URL,
///      même si aucune page ne l'affiche — le premier verrou seul ne
///      protégerait donc rien. Les sources sont dans `storage/photos-sources/`,
///      hors du dossier servi et hors du suivi Git.
/// Les chemins ci-dessous ne résolvent volontairement que pour les images
/// publiables.
///
/// RÉSOLUTION — à demander à l'association : sur les trois images publiables,
/// seule `atelier-1` est en pleine définition (1638 × 2048). `annonce` ne fait
/// que 640 × 800 et `formateurs` 384 × 480, parce qu'elles ont été récupérées
/// depuis Facebook, qui recompresse. Elles restent lisibles mais manquent de
/// netteté sur les écrans à forte densité. Le photographe du projet a
/// forcément les originaux.
export const gallery = [
  {
    src: '/projets/reves-2/reves2-atelier-1.jpg',
    caption: "Atelier d'écriture en petits groupes, pendant le programme d'alphabétisation.",
    publishable: true,
    consentNote: 'Non identifiante : noir et blanc, visages non visibles.'
  },
  {
    src: '/projets/reves-2/reves2-formateurs.jpg',
    caption: 'Les formateurs du programme RÊVES 2, mobilisés pour encadrer les enfants.',
    publishable: true,
    consentNote: "Support déjà diffusé par l'association ; majoritairement des adultes."
  },
  {
    src: '/projets/reves-2/reves2-annonce.jpg',
    caption: "Premiers pas dans l'alphabétisation — samedi 5 septembre 2026, lancement de RÊVES 2.",
    publishable: true,
    consentNote:
      "Visuel de campagne publié par l'association elle-même, logos One Love et Angel Foundation intégrés."
  },
  {
    src: '/projets/reves-2/reves2-arrivee.jpg',
    caption: 'Les enfants arrivent au centre, prêts à découvrir et apprendre.',
    publishable: false,
    consentNote: 'Visages en gros plan reconnaissables — en attente de confirmation.'
  },
  {
    src: '/projets/reves-2/reves2-atelier-2.jpg',
    caption: 'Deux enfants dessinent ensemble pendant une activité artistique.',
    publishable: false,
    consentNote: 'Visages partiellement reconnaissables — en attente de confirmation.'
  },
  {
    src: '/projets/reves-2/reves2-enfant-1.jpg',
    caption: 'Un enfant du centre, pendant une pause entre deux activités.',
    publishable: false,
    consentNote: 'Portrait brut, enfant identifiable.'
  },
  {
    src: '/projets/reves-2/reves2-enfant-2.jpg',
    caption: "Atelier d'écriture en fin de journée.",
    publishable: false,
    consentNote: 'Portrait brut, enfant identifiable.'
  },
  {
    src: '/projets/reves-2/reves2-enfant-3.jpg',
    caption: "Une enfant concentrée sur son cahier pendant l'atelier.",
    publishable: false,
    consentNote: 'Portrait brut, enfant identifiable.'
  }
] as const;

/// Seules ces images-là sont rendues côté public.
export const publishableGallery = gallery.filter((photo) => photo.publishable);

/// Moyens de don. Le virement bancaire existe déjà et son RIB est publié par
/// l'association elle-même sur le site actuel ; Stripe et Mobile Money
/// arriveront au jalon 4.
///
/// [À COMPLÉTER] IBAN à reprendre de la page actuelle une fois confirmé qu'il
/// est toujours valide, et opérateur Mobile Money à obtenir.
/// Coordonnées bancaires, relevées le 23/09/2026 sur la page « Faire un don »
/// que l'association publie elle-même. À FAIRE CONFIRMER par le trésorier
/// avant mise en ligne : un IBAN erroné sur un site de dons se paie cher.
export const bankTransfer = {
  holder: 'Association One Love',
  iban: 'FR76 1027 8060 4100 0209 0550 159',
  bic: 'CMCIFR2A',
  needsConfirmation: true
} as const;

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
