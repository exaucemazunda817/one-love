# Historique des modifications — site One Love

Journal des demandes de Mazunda et de ce qui a été fait, séance par séance.
Le détail technique (pièges, règles à ne pas contourner) reste dans
`CLAUDE.md` ; ici, le fil des changements visibles, dans l'ordre.

## 27/09/2026 (soir) — Page d'accueil : « Une journée », « Trois façons d'aider », citation

Toutes ces modifications ont été vérifiées en local (ordinateur 1440 et
1024 px, tablette 820 px, téléphone 375 px) avant publication, puis contrôlées
sur le site en ligne (`one-love-nu.vercel.app`) après chaque déploiement.

### 1. « Une journée à One Love » refaite en mosaïque — commit `6d762cc`

**Demande :** « Travaille le design de la partie Une journée à One Love, son
design ne me plaît pas vraiment. »

**Avant :** quatre cartes penchées de même taille, un trait de pinceau sous
chaque photo, et une rangée qui glissait sur le côté sur téléphone.

**Après :**
- **Ordinateur :** mosaïque — « L'arrivée » en grande photo à gauche,
  « Atelier d'écriture » en large en haut à droite, « Français » et
  « Création et jeu » en dessous. Texte posé sur la photo, sur un dégradé
  sombre.
- **Tablette :** quatre photos en 2 × 2.
- **Téléphone :** la première photo en grand, les trois suivantes en lignes
  compactes (petite photo + texte). Plus aucune rangée qui glisse.
- Textes (français et anglais) et photos **inchangés** ; seuls la mise en page
  et le cadrage des photos ont changé.
- Plus d'inclinaison des cartes : c'est elle qui faisait déborder la rangée et
  « caler » le défilement au trackpad (problème signalé plus tôt le même jour).

Publiée d'abord sur la branche `claude/trusting-pasteur-693coh` pour
validation, puis mise en ligne sur demande (« met en ligne »).

### 2. Numéros sans icônes, titre retravaillé — commit `79cb7fc`

**Demande :** « Enlève ces icônes à côté des numéros dans les photos, et
arrange aussi ce titre : Une journée à One Love. »

- Icônes retirées : il ne reste que les numéros 01 à 04.
- Titre **centré** au-dessus des photos, « One Love » **souligné au pinceau**
  (même effet que le mot « amour » en haut de la page), phrase « Ce que votre
  soutien rend possible, au fil de la journée. » juste en dessous (avant, elle
  était isolée à droite).
- La grande photo « L'arrivée » avait été trop assombrie par le renforcement
  du dégradé (fait pour rendre le « 04 » lisible) : elle a retrouvé un
  dégradé plus léger.

### 3. Même effet sur « Trois façons d'aider » — commit `8683a4b`

**Demande :** « Le même effet que sur le titre Une journée à One Love, mets-le
sur le titre Trois façons d'aider. »

- Titre centré, « aider » souligné au pinceau (« help » sur la version
  anglaise).

### 4. Éventail au défilement sur les trois cases, citation centrée — commit `1212512`

**Demande :** « Crée un effet visuel de défilement sur les trois cases :
Donner, Parrainer, S'engager. Et dispose la citation du pasteur Kanda au
milieu. »

- **Ordinateur :** en descendant, les cases arrivent en éventail — « Donner »
  depuis la gauche en pivotant légèrement, « Parrainer » par le bas,
  « S'engager » depuis la droite — et se posent à leur place quand elles
  atteignent le milieu de l'écran. L'effet suit le défilement : il se rejoue
  à l'envers en remontant.
- **Téléphone :** chaque case monte et apparaît à son tour.
- Le défilement n'est jamais piloté (sa position est seulement lue), la page
  ne déborde jamais sur le côté, la molette défile normalement au-dessus des
  cases. Avec « Réduire les animations », les cases s'affichent directement à
  leur place.
- **Citation de Kanda Kabangu** centrée sur la page.

### Point connu, non traité

- La photo de l'« Atelier d'écriture » (`photo-ecriture.jpg`) sert aussi de
  fond au bandeau « Projet en cours » juste au-dessus : la même photo apparaît
  deux fois de suite sur l'accueil. À remplacer si l'association fournit
  d'autres photos publiables (voir les règles de consentement dans
  `src/lib/content.ts`).
