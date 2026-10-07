-- Parrainage dans la devise choisie (07/10/2026). Ajouts seulement : aucune
-- donnée existante n'est modifiée ni supprimée.
ALTER TABLE "sponsors" ADD COLUMN IF NOT EXISTS "monthlyAmount" DECIMAL(18,2);
ALTER TABLE "sponsors" ADD COLUMN IF NOT EXISTS "currency" "Currency" NOT NULL DEFAULT 'EUR';
