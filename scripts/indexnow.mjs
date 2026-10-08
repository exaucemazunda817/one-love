// Signale les pages du site aux moteurs IndexNow (Bing, Yandex, Seznam, Naver…)
// pour qu'ils viennent les relire sans attendre leur prochain passage.
//
// Lancé automatiquement par .github/workflows/indexnow.yml après chaque mise en
// ligne réussie sur Vercel (production). À la main : `npm run indexnow`.
//
// La clé n'est pas un secret : le protocole exige qu'elle soit publiée dans
// public/<clé>.txt, c'est ce fichier qui prouve que le site nous appartient.
// Si on change de clé, renommer le fichier et mettre à jour KEY ici.
//
// On envoie tout le sitemap à chaque mise en ligne : le site compte une
// cinquantaine d'adresses, bien en dessous de la limite de 10 000 par envoi.

const SITE = (process.env.SITE_URL || 'https://www.associationonelove.org').replace(/\/$/, '');
const KEY = 'c0f1cc047509604087b14f15da56a63f';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const host = new URL(SITE).host;
  const keyLocation = `${SITE}/${KEY}.txt`;

  // Sans fichier de clé en ligne, les moteurs refusent l'envoi (403) :
  // on vérifie avant, pour un message clair.
  const keyRes = await fetch(keyLocation, { redirect: 'manual' });
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : '';
  if (keyBody !== KEY) {
    throw new Error(`Fichier de clé introuvable ou incorrect : ${keyLocation} (statut ${keyRes.status})`);
  }

  const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
  if (!sitemapRes.ok) throw new Error(`Sitemap illisible (statut ${sitemapRes.status})`);
  const xml = await sitemapRes.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim().replace(/&amp;/g, '&'))
    // IndexNow refuse un envoi qui mélange les hôtes.
    .filter((u) => new URL(u).host === host);
  const unique = [...new Set(urlList)];
  if (unique.length === 0) throw new Error('Aucune adresse trouvée dans le sitemap.');

  console.log(`${unique.length} adresses trouvées pour ${host}.`);
  if (dryRun) {
    console.log('Essai à blanc : rien envoyé.');
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation, urlList: unique })
  });
  // 200 = reçu, 202 = reçu, clé en cours de vérification. Le reste est une erreur.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`Envoi refusé par IndexNow : statut ${res.status} ${await res.text()}`);
  }
  console.log(`Envoyé à IndexNow (statut ${res.status}).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
