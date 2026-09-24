# One Love — mémoire du projet

Site public et logiciel de gestion de l'association **One Love** (loi 1901,
RNA W951001528), qui accompagne des enfants de la rue à Kinshasa. Mazunda
pilote le projet comme prestataire externe, sans écrire le code.

Plan complet approuvé : `~/.claude/plans/deep-noodling-zephyr.md`.

## Architecture

Un seul projet Next.js, deux zones : **site public** sur le domaine,
**logiciel de gestion sous `/gestion`** avec sa propre authentification. Une
base, un déploiement, un domaine — comme `abg-rdc`. Décision prise pour qu'un
don encaissé sur le site tombe directement en comptabilité, sans passerelle.

Stack : Next.js 16.3.4 (App Router) · React 19 · TypeScript strict ·
Tailwind v4 (tokens `:root` + `@theme inline`, aucun fichier de config) ·
Prisma 6.19.3 · PostgreSQL Neon · zod · motion · police Lato.

## État d'avancement

- **Jalon 0 — Socle : FAIT.** Projet créé, schéma Prisma complet (27 tables)
  poussé en base, tokens de couleur, typage et construction de production
  propres.
- **Jalon 1 — Vitrine : FAIT.** 9 pages publiques (accueil, association,
  actions, RÊVES 2, galerie, dons, contact, mentions légales, confidentialité)
  plus sitemap et robots. En-tête avec menu mobile, pied de page, composant
  d'apparition au défilement. Vérifié à 1280 px et 375 px : 13 routes en 200,
  404 fonctionnel, console propre, aucun débordement horizontal.
- **Jalon 2 — Formulaires publics : FAIT.** Contact, candidature bénévole et
  partenariat (en onglets sur `/contact`), newsletter en double opt-in (pied
  de page + `/newsletter/confirmer`) — zod, `allowRequest`, notification par
  e-mail (Resend, silencieux tant que non configuré), écriture en base
  vérifiée pour les quatre. Rate limiting testé (429 après la limite),
  injection `javascript:` bloquée. Session HMAC et `src/proxy.ts` posés pour
  `/gestion`, pas encore d'écran de lecture derrière (à faire si besoin avant
  le jalon 5).
- **Jalon 7 — Bénéficiaires : FAIT, verrouillé.** Fiches enfants,
  inscriptions par projet, prestations, consentements — construits en
  entier, mais **inactifs tant que la DIRECTION ne les a pas activés
  explicitement** (`AppSettings.beneficiariesEnabled`, une phrase de
  confirmation à taper mot pour mot, pas juste un bouton). Décision prise
  avec Mazunda le 23/09 : les décisions RGPD de l'association (référent,
  base légale, durées de conservation, politique de protection de
  l'enfance) restent en attente — le squelette est prêt, personne ne peut
  encore y saisir de vraie donnée d'enfant. **`AppSettings` est vide en base
  aujourd'hui** (mon activation de test a été annulée après vérification) :
  la prochaine personne qui coche la case doit être une vraie décision de
  l'association, jamais un réflexe.
  Vérifié de bout en bout avec deux comptes de test (DIRECTION, TERRAIN,
  supprimés après coup) : module bloqué à la fois page ET API avant
  activation ; activation refusée sur une confirmation incorrecte ; après
  activation, TERRAIN peut créer une fiche (code `OL-2026-0001` généré
  automatiquement), l'inscrire à RÊVES 2, enregistrer une prestation sans
  aucun champ clinique, accorder puis retirer un consentement (une seule
  ligne par portée, jamais de doublon) ; DIRECTION ne voit que des
  compteurs agrégés — accès à la liste et à toute fiche individuelle
  refusé, page ET API (403), y compris en tapant l'URL directement.
  Journal d'audit vérifié : jamais un prénom, uniquement des identifiants
  et le code de référence ; chaque consultation de fiche journalisée
  (`VIEW_SENSITIVE`).
- **Jalon 9 — Inventaire : FAIT.** Registre des biens (`Asset`, code
  `BIEN-2026-0001` généré automatiquement) avec catégorie, état, statut,
  localisation, financement (fonds général ou projet), et historique
  d'affectation (`AssetAssignment`) à une personne ou à un site — un seul
  actif à la fois par bien, contrôlé côté API. La remise fixe le statut à
  « En service », le retour à « En stock » (sauf bien déjà retiré/perdu).
  Le retrait (« Retiré »/« Perdu ») exige un motif, imposé par le schéma zod.
  **Aucun rôle « logistique » n'existant dans la matrice du plan**, décision
  prise pour ce jalon : DIRECTION et TERRAIN gèrent le registre et les
  affectations (à la différence du jalon 8, où DIRECTION n'était que
  lectrice) ; COMPTABLE lit tout pour sa valeur financière (montant
  d'acquisition, projet financeur) sans jamais modifier ; RH et LECTURE
  n'ont aucun accès. Vérifié page **et** API pour les quatre rôles, avec des
  comptes de test et un bien de test supprimés après coup.
  **Valeur indicative** (`computeIndicativeValueEur`) : linéaire simple à
  partir du montant d'acquisition et de la durée de vie utile, purement
  informative — jamais une écriture, l'association n'amortit pas
  (comptabilité de trésorerie). **L'achat lui-même n'est pas généré
  automatiquement** : il se saisit séparément dans la comptabilité comme une
  dépense ordinaire, conformément à la décision du jalon 0.
  **Deux vrais bugs trouvés et corrigés en testant** : (1) le statut par
  défaut d'un bien fraîchement créé était `IN_USE` (« En service ») dans le
  schéma du jalon 0, un oubli antérieur au circuit d'affectation — corrigé en
  `IN_STOCK` (« En stock »), cohérent avec le fait qu'un bien enregistré mais
  jamais remis à personne n'est pas réellement « en service ». (2) La route
  `POST /api/gestion/biens/[id]/affectations` (segment dynamique imbriqué
  sous un autre segment dynamique `[id]`) renvoyait un vrai 404 de routage
  Next.js en développement alors qu'elle existait bel et bien sur le disque
  et apparaissait correctement dans le build de production — un simple
  redémarrage du serveur de dev ne suffisait pas, il a fallu vider `.next`
  puis redémarrer pour que Turbopack redécouvre la route. **Leçon retenue
  pour ce projet** : si une route API à segments dynamiques imbriqués
  renvoie un 404 en dev malgré un fichier `route.ts` au bon endroit, vider
  `.next` avant de chercher un bug de code.
- **Jalon 8 — Équipe et paie : FAIT.** Annuaire (`TeamMember`), contrats
  (`EmploymentContract`), versements de paie (`PayrollEntry`) avec cycle
  DRAFT → APPROVED → PAID. Un versement passé en PAID génère une et une seule
  écriture de dépense (`markPayrollEntryPaid` dans `src/lib/team.ts`, même
  schéma d'idempotence que les dons — relation 1-1 `Transaction.payrollEntryId`,
  P2002 traité comme un rejeu inoffensif). La Transaction créée démarre en
  DRAFT et suit le cycle normal de validation/verrouillage du jalon 6, sans
  raccourci.
  Matrice d'accès : RH a la pleine main (annuaire, contrats, paie).
  DIRECTION lit tout, sans aucun bouton de création/action — **vrai bug
  trouvé et corrigé en testant** : le bouton « Nouvelle personne » restait
  visible pour DIRECTION dans `TeamManager.tsx`, qui n'avait aucune prop
  `canManage` ; l'API le refusait déjà (403), mais l'interface proposait une
  action interdite. COMPTABLE n'a accès qu'au registre de paie transversal
  (`/gestion/equipe/paie`, montants et statuts uniquement, jamais l'annuaire
  ni les contrats) — c'est la lecture littérale de « R (montants) » dans la
  matrice du plan. TERRAIN reçoit un annuaire minimal filtré **côté serveur**
  (nom, fonction, engagement — jamais coordonnées ni salaire), sans accès à
  la fiche détaillée. LECTURE n'a aucun accès. Vérifié aux deux niveaux
  (page et API, y compris en appelant les routes API directement en contournant
  l'interface) pour les quatre rôles concernés, avec des comptes de test
  supprimés après coup (y compris la Transaction et l'AuditLog générés).
  **Deuxième vrai bug trouvé et corrigé** : `ENGAGEMENT_LABELS` (libellés
  français des types d'engagement) était défini et exporté depuis
  `TeamManager.tsx`, un module `'use client'`. Un composant serveur
  (`page.tsx`) qui importe une constante depuis un module client ne reçoit
  pas la vraie valeur — Next.js remplace les exports d'un module client par
  une référence d'hydratation, donc l'accès `ENGAGEMENT_LABELS[...]` échouait
  silencieusement et retombait sur l'enum brut (`SALARIED_DRC` affiché au lieu
  de « Salarié — RDC »), sans aucune erreur dans les journaux serveur.
  **Leçon retenue pour ce projet** : toute constante partagée entre un
  composant serveur et un composant client doit vivre dans un module neutre
  (`src/lib/*.ts`, sans `'use client'`), jamais être exportée depuis le
  fichier client puis réimportée côté serveur — déplacé dans
  `src/lib/team.ts`.
  **Correctif de schéma au passage** : `PayrollEntry.projectId` n'avait pas
  de vraie relation Prisma (contrairement à `Transaction.projectId`) — un
  oubli du jalon 0, corrigé en ajoutant `Project.payrollEntries` /
  `PayrollEntry.project`, poussé en base sans perte de données (table vide à
  ce moment-là).
- **Jalon 6 — Comptabilité : FAIT.** Comptes de trésorerie, catégories (un
  seul niveau), journal avec cycle DRAFT → VALIDATED → LOCKED (ou
  → CANCELLED), pièces justificatives (Vercel Blob privé, repli local),
  export Excel, bilan par projet. Écran séparé et restreint pour TERRAIN
  (« Mes dépenses », dépenses uniquement, jamais le journal complet — vérifié
  page ET API). Vérifié de bout en bout avec trois comptes de test
  (COMPTABLE, DIRECTION, TERRAIN) : séparation des tâches à la validation
  (le bouton disparaît sur ses propres écritures après rechargement),
  verrouillage rendant une écriture réellement immuable (re-verrouiller et
  re-valider refusés), export Excel, dépôt et relecture authentifiée d'un
  justificatif, calcul de contre-valeur euro exact (145 000 CDF à 2900 = 50 €).
  **Vrai bug corrigé avant de commencer ce jalon** : la table `projects`
  était vide depuis le début — tout don flêché vers RÊVES 2 depuis le jalon 4
  perdait silencieusement son rattachement. Projet RÊVES 2 créé en base avec
  le contenu déjà vérifié de `content.ts`, rien d'inventé.
  **Transferts entre comptes non construits** : le schéma les prévoit
  (`TransactionKind.TRANSFER`, `transferGroupId`) mais la convention de signe
  n'était définie nulle part — plutôt que de deviner, l'écran de saisie ne
  propose que Recette/Dépense pour l'instant. À concevoir explicitement avec
  Mazunda le jour où un vrai transfert France → Kinshasa doit être enregistré.
- **Jalon 5 — Comptes nominatifs : FAIT.** Connexion e-mail/mot de passe
  (bcryptjs), changement de mot de passe forcé à la première connexion,
  cinq rôles, gestion des comptes et journal d'audit réservés à DIRECTION
  (page **et** API, double verrou vérifié). Session étendue à
  `{ userId, tokenVersion, exp }` — le rôle n'est jamais porté par le jeton,
  toujours relu frais depuis la base (`getCurrentGestionUser`, mémoïsée par
  requête avec `cache()` de React pour éviter de doubler les appels DB entre
  le layout et chaque page). Vérifié en conditions réelles : un compte
  suspendu perd l'accès à la requête suivante **sans se déconnecter**, sans
  attendre l'expiration du cookie de 8 h ; auto-suspension bloquée ; dernier
  compte DIRECTION actif protégé.
- **Jalon 4 (partie 1) — Paiements Stripe : FAIT.** Checkout Session (carte +
  SEPA) créée par appel REST direct (`src/lib/stripe.ts`, Basic Auth, pas de
  SDK — même choix que Resend), webhook `/api/webhooks/stripe` avec
  vérification de signature HMAC-SHA256 en Node `crypto` (six scénarios
  vérifiés par script `tsx` autonome, dont horodatage rejoué et corps modifié
  après signature). Logique de confirmation centralisée dans
  `src/lib/donations.ts`, réutilisable pour SerdiPay et la confirmation
  manuelle. Sans clés réelles, tout refuse proprement (503 sur la création de
  session, 500 sur le webhook) plutôt que de planter — vérifié dans le
  navigateur. **SerdiPay reporté** : la doc technique publique n'existe pas
  (les deux liens « Documentation de l'API » du site renvoient vers `#`, le
  sous-domaine qui ressemble à un portail développeur est vide). L'option
  Mobile Money est annoncée sur `/dons` comme « bientôt disponible », sans
  aucun appel réseau deviné. À reprendre dès que Mazunda a un accès réel
  (compte marchand, vraie doc transmise par SerdiPay).
- **Refonte visuelle selon le dossier de maquettes (24/09) : FAITE en local, pas
  encore commitée ni déployée.** Le site déjà en ligne est modifié, pas
  reconstruit : mêmes routes, même Stripe, même base. Nouveau système de
  design (Lora + Nunito Sans, tokens cuivre/nuit/crème, un seul point de
  rupture `dk:` à 1200 px), bilingue FR (racine) / EN (`/en/...`, chemins
  identiques). Pages : accueil, dons (3 étapes), association, actions,
  s'impliquer, transparence, contact, parrainer, actualités/galerie, RÊVES 2,
  plus pages légales/utilitaires restylées (FR seulement, voulu). Architecture
  : `src/components/site/pages/*Page.tsx` (serveur, texte + métadonnées) +
  `*Interactive.tsx` (client, état seulement) ; ne jamais passer une fonction
  d'un composant serveur à un composant client (erreur « Functions cannot be
  passed directly to Client Components »). La galerie n'affiche que
  `publishableGallery`. Les articles d'actualités sont des EXEMPLES de la
  maquette, signalés « à remplacer » à l'écran. Vérifié : 24 routes en 200,
  aucun débordement horizontal à 320/375 px, build de production propre.
  Reste : commit + push + vérifier que Vercel passe en READY ; tester le
  bouton Stripe en ligne. Décision de Mazunda (24/09) : la barre basse mobile
  « Faire un don » + WhatsApp a été supprimée (le don est déjà dans le menu) ;
  la barre de navigation est une pilule flottante en verre dépoli.
  Bandeaux : `HeroBackground` fait tourner au hasard, toutes les ~6 s, les cinq
  photos d'enfants de `src/lib/hero-photos.ts` (fondu, tirage sans remise,
  pause si onglet masqué / économie de données / animations réduites). Ne pas
  retirer `isolate` du conteneur : sans lui, le calque entrant passe au-dessus
  du texte. `photo-atelier.jpg` était le collage « Formateurs » décrit à tort
  comme « un garçon écrit » : remplacé par `photo-cahier.jpg` (IMG_7578, en
  haute définition).
- Jalons 3, 4 (partie 2), 10 : à faire. Voir le plan.

**Décision de Mazunda (23/09) : le nouveau site ne fait AUCUNE référence à
l'ancien WordPress.** Ni lien, ni mention « site en construction », ni
« ancien site ». C'est un site neuf et il se présente comme tel.

## Base de données

Projet Neon **`one-love`** (`gentle-wave-51740285`), branche `br-blue-lake-b2995w3m`,
région **`aws-eu-central-1` (Francfort)**.

La région UE est un choix délibéré et non négociable : association française,
données de mineurs vulnérables. Tous les autres projets Neon de Mazunda sont en
région américaine — ne pas copier ce réflexe ici. Idem pour Vercel et pour le
store Blob au moment du déploiement.

**Piège Neon connu sur ce compte (offre gratuite)** : le calcul se met en
veille immédiatement entre deux requêtes (`suspend_timeout_seconds: 0`, non
modifiable sur ce plan). Une commande Prisma ou un rechargement de page juste
après une pause échoue en `P1001`. Réveiller d'abord avec l'outil MCP Neon
`run_sql` (`SELECT 1;`), puis relancer. Ce n'est jamais un bug de code.

## Décisions de conception à ne pas contourner

**L'argent est en `Decimal`, jamais en `Float`.** Chaque mouvement porte trois
colonnes solidaires : montant d'origine + devise (ce qui figure sur la facture
congolaise), taux appliqué, et contre-valeur en euros **figée** au moment de
l'opération. On ne recalcule jamais cette contre-valeur, sinon le bilan d'un
projet clos changerait à chaque variation du taux. Prisma renvoie des objets
`Decimal.js` non sérialisables vers un composant client : convertir en chaîne
côté serveur, et faire tous les calculs côté serveur.

**Pas de double comptage.** Un don confirmé et un versement de paie ne peuvent
produire qu'une seule écriture — garanti par les relations 1-1
`Transaction.donationId` et `Transaction.payrollEntryId`.

**Comptabilité de trésorerie**, pas de partie double, pas de plan comptable
ANC 2018-06. Décision assumée : disproportionné pour cette association et
inutilisable sans quelqu'un sachant tenir une partie double.

**Reçus fiscaux CERFA : tables présentes, écrans volontairement absents.** Une
association ne peut en délivrer que si elle remplit les conditions d'intérêt
général des articles 200 et 238 bis du CGI. Ce n'est pas un réglage logiciel.
Ne rien promettre sur le site tant qu'un rescrit fiscal ne l'a pas confirmé.

## Données des enfants — règles fermes

Le RGPD s'applique pleinement (association établie en France), et les personnes
concernées sont des **mineurs vulnérables**.

- `CareEvent` enregistre qu'une **prestation** a été délivrée, jamais un état
  de santé. Pas de diagnostic, pas de traitement, pas de compte rendu clinique.
  C'est cette limite qui fait sortir le logiciel de l'article 9 du RGPD. **Ne
  jamais y ajouter de champ décrivant l'état de l'enfant.**
- **Aucun champ de notes en texte libre sur la fiche enfant.** C'est là que
  finissent systématiquement les données sensibles qu'on avait décidé de ne pas
  collecter. Ne jamais en ajouter un.
- `Child.referenceCode` circule partout ailleurs ; l'identité ne vit que sur la
  table `Child`, accessible au seul rôle `TERRAIN`. Les exports comptables ne
  contiennent aucun nom.
- `birthYear` et non une date de naissance : ces enfants n'ont le plus souvent
  pas d'acte de naissance, leur âge est estimé.
- Aucune photo d'enfant n'est publiable sans un `MediaConsent` `GRANTED` non
  révoqué. À faire respecter **par le code**, pas par une consigne.
- **Appliqué dès le jalon 1** : chaque image de `gallery` dans `content.ts`
  porte un champ `publishable` et un `consentNote` justifiant la décision.
  Seules les images non identifiantes (visages non visibles) et les supports
  de communication que l'association a elle-même diffusés avec ses logos sont
  publiées. Les portraits d'enfants reconnaissables restent à `false` tant que
  Mazunda n'a pas confirmé que les consentements ont été recueillis. Les pages
  n'affichent que `publishableGallery`, jamais `gallery`.

## Design

Palette **échantillonnée sur la marque réelle**, pas inventée : `#3C3C3B` et
`#BF5B17` viennent des pixels du logo officiel (`public/brand/logo-one-love.png`) ;
`#FFB119` et `#6B6864` sont mesurés sur le site WordPress actuel. Police Lato,
celle du site actuel.

Deux interdits vérifiés par calcul de contraste :
- `--ol-ember` (#BF5B17) plafonne à **4,45:1** sur blanc — décoratif seulement,
  jamais de texte courant dessus. Pour du texte ou un bouton plein, utiliser
  `--ol-ember-ink` (#9A4712, 6,39:1).
- `--ol-amber` (#FFB119) tombe à **1,82:1** sur blanc — réservé aux fonds
  sombres (9,67:1 sur `--ol-night`).

Lancer le skill `audit-design-site` avant de considérer la vitrine terminée.

Aucune couleur, ombre ou arrondi écrit en dur dans les composants publics : tout
passe par les jetons de `globals.css` (`text-taupe`, `bg-track`,
`bg-disabled`, `rounded-card` = 20 px, `shadow-ol-xs/sm/md/lg/card/photo/hover/float`).
Les icônes Phosphor prennent leur couleur par `className="text-…"`, pas par
l'attribut `color`. Les tailles de police restent celles de la maquette
(handoff haute fidélité) : ne pas les « arrondir ».

## Contenu

Tout est centralisé dans `src/lib/content.ts`, avec une distinction stricte
entre contenu vérifié et provisoire. **Règle : ne jamais transformer un
`[À COMPLÉTER]` en contenu définitif sans confirmation explicite de Mazunda.**
C'est une vraie association, avec de vrais donateurs.

**Plus aucune étiquette « à confirmer » à l'écran (audit du 24/09/2026).** Les
composants `ToConfirm` et `PlaceholderPhoto` ont été supprimés : un donateur
voyait « témoignage fictif, à remplacer » sur une page de collecte. Un contenu
non vérifié est désormais **retiré**, jamais affiché avec une étiquette.
Décisions de Mazunda à cette date :
- Retirés (fictifs ou non vérifiés) : témoignages « Grâce N. » et « Pascal D. »,
  articles d'exemple (accueil et Actualités), chiffres « 48 enfants » et
  « 6 formateurs », horaires de « Une journée à One Love », liste des besoins en
  nature, répartition des fonds 82/10/8 %, faux rapports PDF, faux numéro
  WhatsApp, section Équipe, cadres « photo à fournir », adresse et horaires de
  visite. À remettre seulement avec les vraies données de l'association.
- **Actualités remises selon la maquette (24/09, à la demande de Mazunda)** :
  filtres par catégorie + cartes, avec effets au survol (carte soulevée, photo
  qui regrossit, liseré crème dans le cadre — classes `ol-news-card` /
  `ol-news-frame` / `ol-gallery-frame` dans `globals.css`). Seuls les 5
  articles adossés à des faits vérifiés de RÊVES 2 sont remis ; « Premier bilan
  médical » (oct. 2026, donc pas encore arrivé) reste écarté, et la date du
  partenariat Angel Foundation est « 2026 » faute de mois vérifié.
- **Validés par Mazunda** : montants des formules de parrainage (20/35/50 € et
  25/30/20 €) et contenu des formules.
- Conservés car exacts : « 2010 » et « 3 axes » ; conversions de devises
  présentées comme « indicatives ».

**Aperçus de partage** : `src/lib/seo.ts` (`pageMetadata`) donne à chaque page
son titre, sa langue et son image. Images statiques `public/og/partage-fr.jpg`
et `partage-en.jpg` (JPEG ~80 Ko) : générées une fois avec `next/og` puis
figées, car la version générée à la volée sortait en PNG de ~780 Ko, trop lourd
pour WhatsApp. Ne pas remettre un `opengraph-image` dans le groupe `(site-en)` :
Next le publie sous une adresse suffixée (`/en/opengraph-image-1cwhjg`) et la
référence en dur répond 404.

**Contradiction non résolue, à trancher avant les mentions légales** : le site
actuel annonce le 44 rue de la Roquette (Paris 11e), une base officielle
indique Châtenay-Malabry.

## Bug réel trouvé et corrigé au jalon 4 (confirmation de don)

`confirmDonation()` (`src/lib/donations.ts`) attrape les violations de
contrainte unique (P2002) pour rester idempotente face à un webhook rejoué.
Piège trouvé en testant avec un script `tsx` autonome : **deux contraintes
uniques différentes peuvent déclencher ce même code d'erreur**, et elles ne
veulent pas dire la même chose.
- `Transaction.donationId` @unique violée = ce don précis a déjà sa
  transaction (webhook rejoué pour le MÊME don) → cas normal, on répond
  `alreadyConfirmed: true`.
- `Donation.stripePaymentIntentId` (ou `serdipayTransactionId`) @unique
  violée = un AUTRE don réclame déjà cette référence de paiement → jamais
  anodin, potentiellement un bug ailleurs. La première version traitait les
  deux cas de façon identique, donc silencieuse : un don pouvait rester
  `PENDING` pour toujours sans jamais lever d'erreur visible.
Corrigé en lisant `error.meta.target` (Prisma) pour distinguer les deux —
vérifié empiriquement avec un script d'inspection avant de coder le correctif,
plutôt que de deviner la forme de l'erreur.

## Architecture publique vs logiciel de gestion (jalon 5)

Le site public vit dans le groupe de routes `src/app/(site)/` avec son
propre `layout.tsx` (en-tête, pied de page, bouton « Faire un don »). La
racine `src/app/layout.tsx` est minimale (police, html/body). **Vrai défaut
trouvé et corrigé** : avant cette séparation, `/gestion` héritait du layout
racine et affichait donc le menu public et le bouton de don au-dessus de
l'écran de connexion — pas acceptable pour un outil interne. `/gestion` a sa
propre coquille indépendante (page de connexion en `<main>` autonome, puis
`gestion/(protected)/layout.tsx`). **Ne jamais faire dépendre `/gestion`
du layout du site public.**

## Piège de test navigateur découvert au jalon 5 (spécifique à cet environnement)

En testant la connexion, `computer left_click` avec un `ref` a échoué à
déclencher plusieurs soumissions de formulaire (aucune requête n'atteignait
le serveur), alors que le même clic via `element.click()` en JavaScript
fonctionnait à chaque fois. Cause non identifiée avec certitude (probable
décalage d'échelle entre la capture et le vrai viewport, déjà documenté sur
gestion-scolaire le 09/09) — pas un bug de l'application : de vrais visiteurs
cliquant avec une vraie souris ne sont pas concernés. **Pour ce projet,
préférer un clic déclenché en JavaScript (`document.querySelector(...).
click()`) à `computer left_click` sur les formulaires `/gestion`, et
toujours vérifier `window.location.href` après coup plutôt que de se fier à
une capture d'écran ou au titre d'onglet, qui peuvent rester figés pendant
qu'une navigation React est encore en cours.**

Piège Neon classique reproduit plusieurs fois pendant ces tests : le calcul
se rendort en quelques secondes, y compris entre deux clics rapprochés dans
le même test. Un simple `SELECT 1` avant de commencer ne suffit pas s'il
s'écoule plus de quelques secondes avant la vraie requête. Pour une séquence
de test un peu longue, lancer un petit script Node qui interroge la base
toutes les 2 secondes en arrière-plan pendant toute la durée du test
(pattern déjà utilisé sur gospel-nation pour ses constructions).

## Piège React trouvé et corrigé au jalon 2

`event.currentTarget` redevient `null` dès que la phase de dispatch de
l'événement se termine — comportement standard du DOM, pas un bug de React.
Dans un gestionnaire `async`, y accéder après un `await` (ex. `event.
currentTarget.reset()` après `await fetch(...)`) lève une exception : l'envoi
réussissait bien côté serveur (201) mais l'utilisateur voyait « Une erreur est
survenue ». **Toujours capturer la référence dans une variable AVANT le
premier `await`** (`const formEl = event.currentTarget`), jamais relire
`event.currentTarget` après. Les quatre formulaires du jalon 2 suivent cette
règle — voir le commentaire dans `ContactForm.tsx` pour le détail.

## Pièges de déploiement (appris sur les projets précédents)

- `"build": "prisma generate && next build"` — déjà en place. Sans lui, Vercel
  réutilise un client Prisma en cache et le déploiement échoue sans alerte.
- Toute variable `NEXT_PUBLIC_*` sur Vercel : type **Configuration**, jamais
  « Sensible ». Valeur non vide, sans retour à la ligne final.
- Après un envoi de code, vérifier que le déploiement est passé en **READY**,
  pas seulement que GitHub a reçu le code.
- Le domaine `associationonelove.org` est chez **OVH**, les e-mails passent par
  **Google**. Ne modifier que les enregistrements A et CNAME — **jamais les MX**.
  Pour Resend, vérifier un **sous-domaine** dédié afin de ne pas casser le SPF.

## Paiements (précisé par Mazunda le 23/09/2026)

**Stripe** : carte, prélèvement SEPA et virement géré par Stripe.
**SerdiPay** : Mobile Money local en RDC — remplace le Mobile Money confirmé
à la main envisagé initialement.
Le virement bancaire manuel actuel (RIB publié) reste disponible en parallèle.

`Donation.stripePaymentIntentId` et `Donation.serdipayTransactionId` sont tous
deux `@unique` : c'est la clé d'idempotence qui empêche un webhook rejoué —
cas normal, les deux prestataires réessaient tant qu'ils n'ont pas reçu un
code de succès — de créditer deux fois le même don. Au jalon 4 : vérifier
chaque paiement **côté serveur** auprès du prestataire, jamais sur la seule
foi du contenu du webhook.

## Ce qui bloque, côté association

Adresse du siège à confirmer · habilitation aux reçus fiscaux (rescrit) ·
dossier Stripe (dont un numéro SIREN, que beaucoup d'associations n'ont pas) ·
accès au compte OVH · décisions RGPD (référent, base légale, durées de
conservation, consentements photo).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
