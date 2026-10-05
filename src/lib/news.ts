// Articles de la page Actualités (/galerie), du plus récent au plus ancien.
// Chaque article reprend une publication de l'association sur Instagram
// (@associationonelove), relevée le 05/10/2026 ; le lien d'origine est gardé.
// Règles : aucun prénom d'enfant, aucun chiffre qui ne figure pas dans la
// publication source. Les photos viennent du site (public/histoire, public/photos) :
// quand elles ne montrent pas l'événement lui-même, le texte alternatif le dit.

export type NewsTag = 'reves' | 'centre' | 'events' | 'village';

type L = { fr: string; en: string };

export type NewsArticle = {
  slug: string;
  date: string; // AAAA-MM-JJ, date de l'événement (ou de la publication)
  tag: NewsTag;
  title: L;
  lead: L;
  body: { fr: string[]; en: string[] };
  img: string;
  alt: L;
  source: string;
};

export const NEWS_TAGS: Record<NewsTag, L> = {
  reves: { fr: 'RÊVES 2', en: 'RÊVES 2' },
  centre: { fr: 'Vie du centre', en: 'Life at the centre' },
  events: { fr: 'Événements', en: 'Events' },
  village: { fr: 'Le village', en: 'The village' }
};

export const NEWS: NewsArticle[] = [
  {
    slug: 'reves-2-premiers-pas-alphabetisation',
    date: '2026-09-05',
    tag: 'reves',
    title: { fr: 'Premiers pas dans l’alphabétisation', en: 'First steps in literacy' },
    lead: {
      fr: 'Samedi 5 septembre, les enfants ont participé à leur toute première séance d’alphabétisation du projet RÊVES 2.',
      en: 'On Saturday 5 September, the children took part in their very first literacy session of the RÊVES 2 project.'
    },
    body: {
      fr: [
        'Une journée rythmée par les premiers apprentissages, l’accompagnement des formateurs et les exercices d’écriture, mais surtout par beaucoup de sourires et de partage.',
        'Chaque lettre apprise et chaque mot écrit représentent un pas de plus. Ce n’est que le début : pendant quatre mois, RÊVES 2 met l’éducation au cœur de son action, avec Angel Foundation à nos côtés.'
      ],
      en: [
        'A day shaped by first lessons, the trainers’ support and writing exercises, but above all by lots of smiles and sharing.',
        'Every letter learned and every word written is one more step. This is only the beginning: for four months, RÊVES 2 puts education at the heart of its work, with Angel Foundation by our side.'
      ]
    },
    img: '/histoire/2026-reves2.webp',
    alt: { fr: 'Le projet RÊVES 2, avec Angel Foundation.', en: 'The RÊVES 2 project, with Angel Foundation.' },
    source: 'https://www.instagram.com/p/DdHIhhejfqo/'
  },
  {
    slug: 'reves-2-formation-des-animateurs',
    date: '2026-09-09',
    tag: 'reves',
    title: { fr: 'Préparer pour mieux transmettre', en: 'Preparing to teach better' },
    lead: {
      fr: 'Avant d’accompagner les enfants, nos animateurs passent eux aussi par une étape essentielle : apprendre à transmettre.',
      en: 'Before supporting the children, our facilitators go through an essential step themselves: learning how to teach.'
    },
    body: {
      fr: [
        'Dans cette première phase de RÊVES 2, Marie-Anne Kemba, formatrice en alphabétisation, forme les animateurs et leur donne les outils et les méthodes nécessaires pour encadrer les enfants lors des séances suivantes.',
        'Elle présente aussi, en vidéo, le projet, ses objectifs et l’importance de cette démarche.'
      ],
      en: [
        'In this first phase of RÊVES 2, Marie-Anne Kemba, a literacy trainer, trains the facilitators and gives them the tools and methods they need to guide the children in the sessions that follow.',
        'In a video, she also presents the project, its goals and why this approach matters.'
      ]
    },
    img: '/histoire/posters/2026-reves2-formation.webp',
    alt: { fr: 'La formation des animateurs de RÊVES 2.', en: 'The RÊVES 2 facilitator training.' },
    source: 'https://www.instagram.com/reel/DdEItmagznY/'
  },
  {
    slug: 'kermesse-educative-fevrier-2026',
    date: '2026-02-25',
    tag: 'events',
    title: { fr: 'Une kermesse éducative avec Angel Foundation', en: 'An educational fair with Angel Foundation' },
    lead: {
      fr: 'Poterie, carnets en pagne, cuisine : une journée pour apprendre en faisant, puis présenter son travail.',
      en: 'Pottery, fabric notebooks, cooking: a day to learn by doing, then show one’s work.'
    },
    body: {
      fr: [
        'Dans le cadre du projet RÊVES, Angel Foundation et One Love ont réuni les enfants autour d’ateliers pratiques : poterie, création de carnets en pagne et cuisine, suivis d’une exposition des réalisations, d’un repas et de moments de convivialité.',
        'Chaque enfant a pu découvrir un savoir-faire, pratiquer, créer et présenter son travail. Le but était simple : développer la créativité et la confiance en soi.'
      ],
      en: [
        'As part of the RÊVES project, Angel Foundation and One Love brought the children together around hands-on workshops: pottery, making notebooks from wax-print fabric and cooking, followed by an exhibition of their work, a meal and time together.',
        'Each child discovered a skill, practised it, created and presented their work. The goal was simple: build creativity and self-confidence.'
      ]
    },
    img: '/histoire/2026-kermesse.webp',
    alt: { fr: 'Les enfants présentent leurs créations à la kermesse de février 2026.', en: 'The children present their creations at the February 2026 fair.' },
    source: 'https://www.instagram.com/angelfoundationrdc/p/DVLid_XjKMs/'
  },
  {
    slug: 'journee-mondiale-enfance-2025',
    date: '2025-11-20',
    tag: 'events',
    title: { fr: 'Journée de l’enfance : à la découverte des métiers', en: 'Children’s Day: discovering jobs' },
    lead: {
      fr: 'Le 20 novembre 2025, les enfants ont visité une entreprise agro-industrielle avec Angel Foundation.',
      en: 'On 20 November 2025, the children visited an agro-industrial company with Angel Foundation.'
    },
    body: {
      fr: [
        'Pour la Journée internationale des droits de l’enfant, les enfants du projet RÊVES ont suivi une visite guidée : découverte des métiers, de la chaîne de production et échanges avec des professionnels.',
        'Des jeux de rôle leur ont permis de se mettre dans la peau d’un responsable qualité, d’un laborantin ou d’un chef d’équipe, pour prendre confiance et imaginer leur avenir.'
      ],
      en: [
        'For International Children’s Rights Day, the children of the RÊVES project took a guided tour: discovering jobs and the production line, and talking with professionals.',
        'Role-play let them step into the shoes of a quality manager, a lab technician or a team leader, to gain confidence and picture their future.'
      ]
    },
    img: '/histoire/2025-centre.webp',
    alt: { fr: 'Les enfants rassemblés dans la cour du centre.', en: 'The children gathered in the centre’s courtyard.' },
    source: 'https://www.instagram.com/p/DRSRvGHiLyG/'
  },
  {
    slug: 'bibliotheque-renovee-2025',
    date: '2025-10-31',
    tag: 'centre',
    title: { fr: 'Le centre fait peau neuve', en: 'The centre gets a makeover' },
    lead: {
      fr: 'Bibliothèque repeinte, espaces extérieurs rafraîchis : le One Love Center devient plus accueillant.',
      en: 'A repainted library, refreshed outdoor areas: the One Love Center is becoming more welcoming.'
    },
    body: {
      fr: [
        'Peu à peu, notre centre se transforme : repeindre la bibliothèque, rafraîchir les espaces extérieurs, ranger, organiser, rendre chaque coin plus vivant.',
        'Après quelques coups de pinceau, un grand tri et beaucoup d’énergie collective, la bibliothèque One Love renaît. Merci à toutes les mains qui ont participé.'
      ],
      en: [
        'Little by little, our centre is changing: repainting the library, refreshing the outdoor areas, tidying, organising, making every corner livelier.',
        'After a few brushstrokes, a big clear-out and lots of team energy, the One Love library has a new life. Thank you to every hand that helped.'
      ]
    },
    img: '/histoire/2025-bibliotheque.webp',
    alt: { fr: 'La bibliothèque rénovée du centre.', en: 'The centre’s renovated library.' },
    source: 'https://www.instagram.com/p/DQdy_IfjSh9/'
  },
  {
    slug: 'diner-caritatif-2024',
    date: '2024-12-13',
    tag: 'village',
    title: { fr: 'Deuxième dîner caritatif : merci !', en: 'Second charity dinner: thank you!' },
    lead: {
      fr: 'Près de 200 personnes réunies au Pullman de Kinshasa, le 13 décembre 2024.',
      en: 'Nearly 200 people gathered at the Pullman in Kinshasa on 13 December 2024.'
    },
    body: {
      fr: [
        'Pour la deuxième édition de notre dîner caritatif, près de 200 personnes sont venues écouter, partager et s’engager, avec une joie immense et une émotion palpable.',
        'Merci à nos sponsors, dont la Fondation Vodacom, sponsor premium, et aux partenaires de la tombola. Grâce à vous, de beaux projets prennent vie pour les enfants que nous accompagnons chaque jour.'
      ],
      en: [
        'For the second edition of our charity dinner, nearly 200 people came to listen, share and get involved, with great joy and real emotion.',
        'Thank you to our sponsors, including the Vodacom Foundation, our premium sponsor, and to the raffle partners. Thanks to you, new projects are coming to life for the children we support every day.'
      ]
    },
    img: '/histoire/posters/2024-merci-diner.webp',
    alt: { fr: 'Le deuxième dîner caritatif, le 13 décembre 2024.', en: 'The second charity dinner, 13 December 2024.' },
    source: 'https://www.instagram.com/p/DENS7bJIbJR/'
  },
  {
    slug: 'noel-2023',
    date: '2023-12-24',
    tag: 'events',
    title: { fr: 'Noël 2023 : des centaines de sourires', en: 'Christmas 2023: hundreds of smiles' },
    lead: {
      fr: 'Une journée de Noël avec 270 enfants, puis une fête avec plus de 350 enfants le 24 décembre.',
      en: 'A Christmas day with 270 children, then a party with more than 350 children on 24 December.'
    },
    body: {
      fr: [
        'Notre journée de Noël a réuni 270 enfants, avec 180 cadeaux offerts par Toylander.',
        'Le dimanche 24 décembre, avec l’ONG Aide-moi à m’envoler, nous avons aussi fêté Noël avec plus de 350 enfants démunis, qui ont tous reçu un cadeau.'
      ],
      en: [
        'Our Christmas day brought together 270 children, with 180 presents donated by Toylander.',
        'On Sunday 24 December, with the NGO Aide-moi à m’envoler, we also celebrated Christmas with more than 350 children in need, who all received a present.'
      ]
    },
    img: '/histoire/2017-noel.webp',
    alt: { fr: 'Une fête de Noël à One Love (photo d’archive).', en: 'A Christmas party at One Love (archive photo).' },
    source: 'https://www.instagram.com/p/C1kj5-JoPwL/'
  },
  {
    slug: 'diner-caritatif-2023',
    date: '2023-12-08',
    tag: 'village',
    title: { fr: 'Premier dîner caritatif : « Une école pour tous »', en: 'First charity dinner: “A school for all”' },
    lead: {
      fr: '236 invités au Pullman de Kinshasa pour lancer la levée de fonds du One Love Village.',
      en: '236 guests at the Pullman in Kinshasa to launch the One Love Village fundraising.'
    },
    body: {
      fr: [
        'Le vendredi 8 décembre 2023, notre premier dîner caritatif a réuni 236 invités autour d’un objectif : construire une école pour les enfants vulnérables. La soirée marquait le lancement de notre campagne de dons pour le One Love Village.',
        'Spectacle de danse et de chant, tombola, présentation du projet avec des images inédites du terrain de Kasangulu : merci à nos sponsors, à nos artistes, au comité d’organisation, à l’hôtel Pullman et à nos One Love Boys.'
      ],
      en: [
        'On Friday 8 December 2023, our first charity dinner brought 236 guests together around one goal: build a school for vulnerable children. The evening launched our fundraising campaign for the One Love Village.',
        'A dance and singing show, a raffle, and a presentation of the project with never-before-seen images of the Kasangulu land: thank you to our sponsors, our artists, the organising committee, the Pullman hotel and our One Love Boys.'
      ]
    },
    img: '/photos/drive/diner-2023-table.jpg',
    alt: { fr: 'Des invités à table lors du premier dîner caritatif.', en: 'Guests at their table at the first charity dinner.' },
    source: 'https://www.instagram.com/p/C0pbwbKINuD/'
  },
  {
    slug: 'rentree-2023',
    date: '2023-09-04',
    tag: 'centre',
    title: { fr: 'C’est la rentrée pour les One Love Boys', en: 'Back to school for the One Love Boys' },
    lead: {
      fr: 'Uniformes, sacs à dos : douze garçons ont repris le chemin de l’école, de la 2e primaire à la 3e secondaire.',
      en: 'Uniforms, backpacks: twelve boys went back to school, from year 2 of primary to year 3 of secondary.'
    },
    body: {
      fr: [
        'Du plus grand au plus petit, nos One Love Boys ont mis leurs uniformes et préparé leurs sacs pour la première journée de l’année 2023-2024. Parmi eux, deux petits nouveaux entraient en 2e primaire.',
        'Nous leur souhaitons une année pleine de joie, de persévérance, de découvertes et de confiance.'
      ],
      en: [
        'From the oldest to the youngest, our One Love Boys put on their uniforms and packed their bags for the first day of the 2023-2024 school year. Among them, two newcomers were starting year 2 of primary.',
        'We wish them a year full of joy, perseverance, discovery and confidence.'
      ]
    },
    img: '/histoire/2023-rentree-2.webp',
    alt: { fr: 'Deux des grands, en uniforme, à la rentrée 2023.', en: 'Two of the older boys in uniform, back to school in 2023.' },
    source: 'https://www.instagram.com/p/Cwxis9ZIvdP/'
  },
  {
    slug: 'kasangulu-la-guerite',
    date: '2023-01-07',
    tag: 'village',
    title: { fr: 'Sur le terrain de Kasangulu, les choses avancent', en: 'On the Kasangulu land, things are moving' },
    lead: {
      fr: 'À 25 km au sud de Kinshasa, la guérite du One Love Village sort de terre.',
      en: '25 km south of Kinshasa, the One Love Village gatehouse is going up.'
    },
    body: {
      fr: [
        'Nous étions sur le terrain One Love de Kasangulu, à 25 km au sud de Kinshasa. Prochaines étapes : terminer la guérite, puis lancer les plans et le dossier d’étude du projet avec un architecte.',
        'La guérite servira à stocker le matériel et à récupérer l’eau de pluie pour le potager et les plantations.'
      ],
      en: [
        'We were on the One Love land in Kasangulu, 25 km south of Kinshasa. Next steps: finish the gatehouse, then start the plans and the project study with an architect.',
        'The gatehouse will store equipment and collect rainwater for the vegetable garden and the planting.'
      ]
    },
    img: '/histoire/2023-kasangulu-2.webp',
    alt: { fr: 'Les travaux commencent à Kasangulu.', en: 'Work begins in Kasangulu.' },
    source: 'https://www.instagram.com/p/CnHsvJ3O5U6/'
  },
  {
    slug: 'course-solidaire-2022',
    date: '2022-12-06',
    tag: 'events',
    title: { fr: '1 542 $ pour la scolarité des enfants', en: '$1,542 for the children’s schooling' },
    lead: {
      fr: 'Les élèves du lycée français René Descartes de Kinshasa ont couru pour la bonne cause.',
      en: 'The pupils of the René Descartes French school in Kinshasa ran for a good cause.'
    },
    body: {
      fr: [
        'Grâce à la course solidaire du lycée René Descartes, nous avons récolté 1 542 $, de quoi payer le minerval de plusieurs enfants.',
        'À Kinshasa, l’école coûte cher : environ 720 $ par enfant et par an, sans compter les fournitures, l’uniforme et les livres. Merci au lycée et à tous les enfants qui ont couru.'
      ],
      en: [
        'Thanks to the René Descartes school charity run, we raised $1,542, enough to pay the school fees of several children.',
        'In Kinshasa, school is expensive: about $720 per child per year, not counting supplies, uniform and books. Thank you to the school and to every child who ran.'
      ]
    },
    img: '/histoire/2022-course-lycee.webp',
    alt: { fr: 'La course du lycée français de Kinshasa.', en: 'The French school run in Kinshasa.' },
    source: 'https://www.instagram.com/p/Cl0W0S5ouzN/'
  },
  {
    slug: 'congo-je-taime-2022',
    date: '2022-07-15',
    tag: 'events',
    title: { fr: '« Congo je t’aime » : quinze jours avec onze bénévoles', en: '“Congo je t’aime”: two weeks with eleven volunteers' },
    lead: {
      fr: 'Du 1er au 15 juillet 2022, un voyage solidaire à Kinshasa, Matadi et Muanda.',
      en: 'From 1 to 15 July 2022, a solidarity trip to Kinshasa, Matadi and Muanda.'
    },
    body: {
      fr: [
        'Onze bénévoles ont partagé notre quotidien pendant quinze jours. Premier jour à Kinshasa : rencontre avec les enfants du centre aéré et un repas partagé avec 120 enfants.',
        'À Matadi, un tournoi de foot avec six équipes, où nos One Love Boys ont même gagné un match contre des seniors. À Muanda, au bord de l’océan Atlantique, un autre tournoi, et pour les garçons la découverte de la mer.'
      ],
      en: [
        'Eleven volunteers shared our daily life for two weeks. First day in Kinshasa: meeting the day-centre children and a meal shared with 120 children.',
        'In Matadi, a football tournament with six teams, where our One Love Boys even won a match against seniors. In Muanda, on the Atlantic coast, another tournament, and for the boys their first sight of the sea.'
      ]
    },
    img: '/histoire/2022-congo-je-taime.webp',
    alt: { fr: 'Avec les enfants, pendant le voyage « Congo je t’aime ».', en: 'With the children, during the “Congo je t’aime” trip.' },
    source: 'https://www.instagram.com/p/CgcVv_ZDXW1/'
  },
  {
    slug: 'sortie-parc-nsele-2022',
    date: '2022-01-05',
    tag: 'events',
    title: { fr: 'Une journée au parc de la Nsele', en: 'A day at the Nsele park' },
    lead: {
      fr: '54 enfants du centre aéré et 11 One Love Boys à la découverte des animaux.',
      en: '54 day-centre children and 11 One Love Boys discovering the animals.'
    },
    body: {
      fr: [
        'Antilopes, hippopotames, lions, zèbres, crocodiles, rhinocéros : une journée d’émerveillement et de fous rires au parc de la vallée de la Nsele.',
        'Merci à nos éducateurs et aux bénévoles venus de Gospel Nation, et à vous tous qui nous soutenez : ce sont vos messages et vos dons qui rendent ces moments possibles.'
      ],
      en: [
        'Antelopes, hippos, lions, zebras, crocodiles, rhinos: a day of wonder and laughter at the Nsele valley park.',
        'Thank you to our educators and to the volunteers from Gospel Nation, and to all of you who support us: your messages and gifts make these moments possible.'
      ]
    },
    img: '/histoire/2022-nsele.webp',
    alt: { fr: 'Les enfants au parc de la vallée de la Nsele.', en: 'The children at the Nsele valley park.' },
    source: 'https://www.instagram.com/p/CYXLPTjrwIZ/'
  }
];

export function newsBySlug(slug: string) {
  return NEWS.find((n) => n.slug === slug);
}

export function formatNewsDate(date: string, locale: 'fr' | 'en') {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
