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
- Jalons 3 à 10 : à faire. Voir le plan.

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

## Contenu

Tout est centralisé dans `src/lib/content.ts`, avec une distinction stricte
entre contenu vérifié et provisoire. **Règle : ne jamais transformer un
`[À COMPLÉTER]` en contenu définitif sans confirmation explicite de Mazunda.**
C'est une vraie association, avec de vrais donateurs.

**Contradiction non résolue, à trancher avant les mentions légales** : le site
actuel annonce le 44 rue de la Roquette (Paris 11e), une base officielle
indique Châtenay-Malabry.

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
