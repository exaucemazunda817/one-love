# One Love — mémoire du projet (version allégée du 03/11/2026)

Site public et logiciel de gestion de l'association **One Love** (loi 1901, RNA W951001528), qui accompagne des enfants de la rue à Kinshasa. Mazunda pilote comme prestataire externe, sans coder. Production : `www.associationonelove.org` (Vercel, Neon Francfort `gentle-wave-51740285`).

**Mémoire détaillée (historique, raisons, pièges, mesures)** : `docs/CLAUDE-detail.md`, NON chargée automatiquement pour économiser les crédits. Avant de toucher à un sujet, lire la section concernée : `grep -n "^## " docs/CLAUDE-detail.md` puis la plage utile. Plan : `~/.claude/plans/deep-noodling-zephyr.md`.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. (Bloc réécrit par `next dev` : le garder tel quel.)

## Architecture
Un seul projet Next.js 16 (App Router, React 19, TypeScript strict, Tailwind v4, Prisma 6, zod, motion, Lato) : **site public** (groupes `(site)` FR et `(site-en)` EN, chacun sa racine `<html lang>` via `RootHtml`) et **logiciel `/gestion`** (sa propre racine, auth e-mail + mot de passe, rôles DIRECTION, COMPTABLE, TERRAIN, RH, LECTURE). Ne jamais faire dépendre `/gestion` du layout public. Ne jamais mettre `headers()` dans un layout racine unique (tout devient dynamique) : plusieurs layouts racines.

## Contenu
- Tout est dans `src/lib/content.ts` (et `news.ts` pour les actualités). **Jamais transformer un `[À COMPLÉTER]` en contenu définitif sans confirmation** ; un contenu non vérifié est **retiré**, jamais affiché avec une étiquette « à confirmer ». Aucune référence à l'ancien WordPress.
- Ton « nous / notre » sur les textes visiteurs (sauf SEO, alt, textes juridiques, signatures d'e-mails). Année de fondation 2013 (2010 = rencontre du couple fondateur). Siège : 44 rue de la Roquette, 75011 Paris (débat clos).
- **Photos d'enfants** : sourire visible seulement, jamais en consultation médicale ; aucune photo publiable sans consentement (`publishableGallery`) ; jamais d'enfant sur les pages légales, dons, parrainage ni dans les bandeaux de RÊVES 2. Photo de la fête de Noël 2023 (foule, ballons) retirée partout.
- Actualités : `src/lib/news.ts` (texte de la légende Instagram sans rien ajouter, aucun prénom d'enfant, aucun chiffre absent de la source). Vidéo : champ `video` + aperçu `<nom>-apercu.mp4` OBLIGATOIRE (8 s, 270×480, < 400 Ko). Le site se télécharge à 12-21 Ko/s à Kinshasa : tout reste léger.
- Tâche quotidienne Instagram + Drive (sur le Mac, publie seule) : `~/.claude/scheduled-tasks/releve-instagram-one-love/SKILL.md`. Elle ne place du contenu que sur RÊVES 2, Centre aéré, One Love Boys, Village, si c'est EXACTEMENT le sujet.

## Données des enfants — règles fermes (RGPD, mineurs vulnérables)
`CareEvent` = prestation, jamais un état de santé. **Aucun champ de notes en texte libre sur la fiche enfant.** `Child.referenceCode` partout, l'identité seulement sur `Child` (rôle TERRAIN). `birthYear`, pas de date de naissance. Module Bénéficiaires verrouillé tant que la DIRECTION ne l'a pas activé (`AppSettings.beneficiariesEnabled`, phrase de confirmation) : ne jamais l'activer par réflexe.

## Argent
`Decimal` jamais `Float`. Trois colonnes solidaires : montant d'origine + devise, taux, contre-valeur en euros **figée**. Pas de double comptage (`Transaction.donationId`, `payrollEntryId` 1-1). Comptabilité de trésorerie. Reçus fiscaux CERFA : tables présentes, aucun écran, rien promis sur le site sans rescrit.
- **Dons** : `/dons` unique (raison : association / One Love Village `one-love-village` / parrainage `parrainage` ; ne pas supprimer ces deux lignes `projects`). Carte et prélèvement via **HelloAsso intégré** (iframe, euros seulement) ; virement avec référence `OL-…` confirmé dans `/gestion/virements` ; Stripe mis de côté (code gardé) ; Mobile Money (pawaPay, branche `feature/pawapay-mobile-money`, ou Moko Afrika) à venir. Dons en €, $ ou FC sans reconversion.
- **Double paiement** : `payment-guard.ts` avant toute session Stripe ; mémoire du paiement en cours dans `localStorage` (jamais nom ni e-mail) ; référence de virement réutilisée 24 h.
- **Parrainage = paiement** : aucune ligne `Sponsor` créée ailleurs que dans le webhook (ou « Virement reçu »). Webhook Stripe : vérifier côté serveur, signature en temps constant, idempotence (`confirmDonation` distingue les deux contraintes P2002).
- Jamais testé avec un vrai Stripe. Variables Resend déjà posées sur Vercel (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`) ; `sendEmail` met `reply_to` = `contact@associationonelove.org` par défaut.

## Sécurité de /gestion
Session HMAC `{userId, tokenVersion, exp}`, rôle relu en base à chaque requête ; la déconnexion incrémente `tokenVersion` ; `requireGestionRole` refuse `mustChangePassword` ; `allowRequest` enregistre la tentative AVANT de compter, `failClosed` pour la connexion ; bcrypt avec hash factice pour égaliser le temps. CSP dans `next.config.ts` (`frame-src` : youtube-nocookie, helloasso). Constante partagée serveur/client : dans `src/lib/*.ts`, jamais exportée d'un module `'use client'`. Aucun cookie sur le site public.

## Design
- Palette sur la marque : `#3C3C3B`, `#BF5B17` (décoratif, 4,45:1 : texte → `--ol-ember-ink` `#9A4712`), `#FFB119` (fonds sombres seulement). Tout par jetons de `globals.css` (couleurs, `shadow-ol-*`, `rounded-card`, voiles `--scrim-0`→`--scrim-5`). Tailles de police = celles de la maquette, ne pas les arrondir.
- Pages : surtitre + titre souligné au pinceau + contenu ; marges de section 36-64 px ; fonds alternés ; pas de photo derrière du long texte ; nouveau bandeau = `<Reveal eager>` ; chaque bandeau a sa liste de photos (aléatoire, pause WCAG 2.2.2), version téléphone verticale.
- Effets d'apparition rejoués à chaque retour (`Reveal repeat`) ; défilement jamais détourné en JS (`scroll-behavior: smooth` : pas de `scrollBy` sur `wheel`) ; pas de conteneur `overflow-x-auto` sur ordinateur si le contenu tient (une inclinaison suffit à capter les gestes) ; sur téléphone listes en défilement natif.
- Intro du logo : jouée à l'ouverture et à l'actualisation, pas depuis une autre page du site. Vidéos : survol (ordinateur) / à l'écran sans le son (téléphone), jamais en économie de données, réduction d'animations ou 2G (3G permise, décision de Mazunda).
- Règles UX `ui-ux-pro-max` : contour de focus dessiné à l'intérieur des cadres `overflow-hidden` (`ol-play-inset`). Lancer `audit-design-site` avant de livrer. Tester les animations dans un vrai Chrome (pas le volet masqué).

## SEO, indexation, domaine
`pageMetadata` (`src/lib/seo.ts`) par page ; images de partage statiques `public/og/partage-fr.jpg` / `-en.jpg` (pas d'`opengraph-image` dans `(site-en)`) ; redirections de l'ancien WordPress et de `one-love-nu.vercel.app` dans `next.config.ts` ; IndexNow automatique (clé publique `public/c0f1cc04…txt`, à ne pas supprimer) ; Search Console et Bing configurés. Domaine chez OVH, e-mails Google : **modifier seulement A et CNAME, jamais les MX** ; Resend sur le sous-domaine `send.`.

## Neon, Vercel, publication
- Neon se rendort : `run_sql SELECT 1` avant toute commande Prisma ou rechargement ; `P1001` n'est jamais un bug de code. Schéma de production par **SQL additif** (`prisma/sql/`), code et fichiers d'abord, données ensuite. Tests de paiement ou de charge sur une **branche Neon jetable** (supprimée ensuite avec l'accord de Mazunda).
- Build : `prisma generate && next build` ; dev local peu fiable après un build : `npm run build` puis `npm run start` sur un port libre. Variables `NEXT_PUBLIC_*` : type **Configuration**, valeur non vide, sans retour à la ligne. `NEXT_PUBLIC_SITE_URL` obligatoire en production.
- Après un push : attendre **READY** (≈ 60-120 s, 3 réponses identiques), tester l'adresse vivante. Piège : `event.currentTarget` est `null` après un `await` (le capturer avant). En test navigateur de `/gestion`, préférer `element.click()` en JS.
- Toujours passer `tabId` quand plusieurs onglets existent ; tuer seulement son propre profil Chrome de test (`pkill -f chrome-profNN`).

## À trancher / à fournir par l'association
Compte Stripe et clés (SIREN) ; règle de partage d'un parrainage (enfant / pot commun) ; décisions RGPD (référent, durées, droit à l'image des enfants) ; politique de confidentialité à réécrire pour le parrainage payant ; directeur de la publication ; accords des prestataires Mobile Money (SerdiPay, Moko Afrika, pawaPay : voir historique global) ; vrais témoignages, chiffres, équipe ; contenu réel du village (surface, phases, budget).
