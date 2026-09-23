// Affichage des dates.
//
// One Love est une association française, mais ses actions se déroulent à
// Kinshasa : une activité annoncée « à 10h00 » l'est en heure de Kinshasa.
// Les serveurs Vercel tournent en UTC, donc sans fuseau explicite le site
// afficherait 09:00. Kinshasa est en UTC+1 toute l'année, sans heure d'été.
//
// Règle du projet : toute date rendue côté serveur précise son fuseau.
export const FIELD_TIME_ZONE = 'Africa/Kinshasa';

// Les dates purement comptables (occurredOn, receivedOn…) sont stockées en
// type Date SQL, sans heure : elles ne subissent aucun décalage et se
// formatent avec formatDateOnly.
export function formatDateOnly(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

// « 10:00 » → « 10h00 ». Chaîne vide quand l'heure est inconnue (enregistré à
// minuit, heure de Kinshasa).
export function formatFieldTime(date: Date): string {
  const time = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FIELD_TIME_ZONE
  });
  return time === '00:00' ? '' : time.replace(':', 'h');
}

// « samedi 5 septembre 2026 à 10h00 », sans « à … » si l'heure est inconnue.
export function formatFieldDateTime(date: Date): string {
  const day = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: FIELD_TIME_ZONE
  });
  const time = formatFieldTime(date);
  return time ? `${day} à ${time}` : day;
}

export function formatDayNumber(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', timeZone: FIELD_TIME_ZONE });
}

export function formatMonthShort(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'short', timeZone: FIELD_TIME_ZONE });
}
