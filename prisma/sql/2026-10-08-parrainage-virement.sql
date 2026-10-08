-- Parrainage par virement (08/10/2026) — ajouts seulement, aucune donnée modifiée.
-- Un parrain par virement n'a pas d'abonnement Stripe ; il attend le premier
-- virement (statut PENDING) avant de devenir parrain.
ALTER TYPE "SponsorStatus" ADD VALUE IF NOT EXISTS 'PENDING' BEFORE 'ACTIVE';
ALTER TABLE "sponsors" ALTER COLUMN "stripeSubscriptionId" DROP NOT NULL;
ALTER TABLE "sponsors" ADD COLUMN IF NOT EXISTS "paymentMethod" "DonationMethod" NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "sponsors" ADD COLUMN IF NOT EXISTS "bankReference" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "sponsors_bankReference_key" ON "sponsors"("bankReference");
