// Champ piège anti-robots : invisible et hors de portée du clavier pour un
// visiteur, mais rempli par les robots qui remplissent tous les champs d'un
// formulaire. Le serveur ignore en silence toute soumission où il est rempli
// (voir /api/contact). Positionné hors écran plutôt que `display:none`, que
// certains robots savent éviter.
//
// Le nom du champ est volontairement banal et sans rapport avec « site web »,
// « url » ou « téléphone » : le remplissage automatique des navigateurs ne le
// reconnaît pas, ce qui évite de bloquer un vrai visiteur.
export const HONEYPOT_FIELD = 'companySite';

export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Ne pas remplir ce champ
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
