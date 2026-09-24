'use client';

import { useEffect } from 'react';

// La racine (app/layout.tsx) est commune aux deux langues et pose
// <html lang="fr">. Ce composant corrige l'attribut lors d'une navigation
// côté client entre /en et le français ; le premier affichage est déjà
// corrigé par le script en tête de app/layout.tsx.
export function HtmlLang({ lang }: { lang: 'fr' | 'en' }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
