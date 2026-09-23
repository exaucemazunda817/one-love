import Image from 'next/image';
import Link from 'next/link';
import { org, identity } from '@/lib/content';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-ol-night text-ol-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div className="space-y-4">
          <Image
            src="/brand/logo-one-love.png"
            alt={org.name}
            width={185}
            height={55}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="max-w-measure text-sm leading-relaxed">{org.tagline}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-amber">
            Découvrir
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/association" className="hover:text-ol-amber">
                L&apos;association
              </Link>
            </li>
            <li>
              <Link href="/actions" className="hover:text-ol-amber">
                Nos actions
              </Link>
            </li>
            <li>
              <Link href="/projets/reves-2" className="hover:text-ol-amber">
                Le projet RÊVES 2
              </Link>
            </li>
            <li>
              <Link href="/galerie" className="hover:text-ol-amber">
                Galerie
              </Link>
            </li>
            <li>
              <Link href="/dons" className="hover:text-ol-amber">
                Faire un don
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-amber">
            Nous joindre
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${org.contactEmail}`} className="hover:text-ol-amber">
                {org.contactEmail}
              </a>
            </li>
            <li>
              <a
                href={org.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ol-amber"
              >
                Facebook
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ol-amber">
                Formulaire de contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 md:col-span-3 md:max-w-md">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-amber">
            Lettre d&apos;information
          </h2>
          <p className="text-sm leading-relaxed">
            Recevez nos actualités de terrain, quelques fois par an.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {org.legalName} — association loi 1901,
            RNA {org.rna}.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/mentions-legales" className="hover:text-ol-amber">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-ol-amber">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">{identity.mission}</p>
    </footer>
  );
}
