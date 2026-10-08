'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  CreditCardIcon,
  DeviceMobileIcon,
  BankIcon,
  CheckIcon,
  ArrowRightIcon,
  LockSimpleIcon,
  CopyIcon,
  ShieldCheckIcon,
  ArrowsClockwiseIcon,
  UsersThreeIcon
} from '@phosphor-icons/react';
import { localeHref, type Locale } from '@/lib/i18n';
import {
  type Currency,
  SYMBOL,
  formatCustom,
  sanitizeAmount,
  startStripeCheckout
} from '@/lib/donation-ui';
import { DONATION_LIMITS, SPONSOR_FROM, SPONSOR_LIMITS, formatMoney } from '@/lib/money';
import { bankTransfer } from '@/lib/content';
import { VILLAGE_SLUG, reasonFromParam, type DonationReason } from '@/lib/funds';

// Montants proposés, FIXÉS dans chaque devise (07/10/2026) : le don est payé
// exactement dans la devise et au montant affichés, sans reconversion. Les
// valeurs en $ et en FC reprennent celles qui s'affichaient déjà. L'ordre
// suit celui des équivalences de T[locale].amounts.
const PRESETS: Record<Currency, readonly number[]> = {
  EUR: [10, 25, 50, 100],
  USD: [11, 28, 55, 110],
  CDF: [31_000, 78_000, 155_000, 310_000]
};
type Method = 'card' | 'momo' | 'virement';

const T = {
  fr: {
    steps: ['Montant', 'Coordonnées', 'Paiement'],
    yourGift: 'Votre don',
    frequency: 'Fréquence',
    freqs: { once: 'Une seule fois', month: 'Tous les mois' },
    amount: 'Montant',
    amounts: [
      [10, 'Un cahier et des crayons pour un enfant, pour un trimestre.'],
      [25, "Un mois de matériel pour un groupe d’atelier."],
      [50, 'Une consultation médicale et son suivi.'],
      [100, "Un mois de formation pour un animateur."]
    ] as const,
    customLabel: 'Ou choisissez votre montant',
    customPlaceholder: 'Autre montant',
    reasonTitle: 'Pourquoi donnez-vous ?',
    reasons: {
      association: { t: 'Un don à l’association', d: 'Utilisé là où les besoins des enfants sont les plus importants.' },
      village: { t: 'Soutenir le projet One Love Village', d: 'Votre don va entièrement à la construction du centre de Kasangulu.' },
      parrainage: { t: 'Parrainer un enfant', d: 'Un engagement mensuel. Dès votre paiement, vous êtes inscrit parmi nos parrains.' }
    } as Record<DonationReason, { t: string; d: string }>,
    planTitle: 'Votre formule de parrainage',
    planNames: ['Éducation', 'Éducation et santé', 'Accompagnement complet'],
    sponsorMonthly: 'Le parrainage se fait chaque mois. Vous pouvez le modifier ou l’arrêter à tout moment.',
    sponsorFrom: (m: string) => `Ces formules sont des repères, pas un minimum : vous pouvez parrainer dès ${m} par mois.`,
    sponsorCustomLabel: 'Ou choisissez votre montant mensuel',
    sponsorEmailNote: '(obligatoire, pour recevoir les nouvelles de votre filleul)',
    phone: 'Téléphone ou WhatsApp',
    optional: '(facultatif)',
    charterPre: 'J’ai lu la ',
    charterLink: 'charte de protection de l’enfant',
    charterPost: ' et je m’engage à la respecter.',
    required: 'Ce champ est obligatoire.',
    emailInvalid: 'Cette adresse e-mail ne semble pas valide.',
    charterRequired: 'Merci d’accepter la charte pour devenir parrain ou marraine.',
    sponsorCardOnly:
      'Le parrainage se règle par carte bancaire (ou prélèvement SEPA en euros) : c’est ce qui vous inscrit automatiquement parmi nos parrains. Pour parrainer par virement permanent, écrivez-nous.',
    sponsorPay: (label: string) => `Payer et devenir parrain · ${label} / mois`,
    sponsorThanks: 'Dès la confirmation de votre paiement, nous vous écrivons avec toutes les informations sur votre filleul.',
    writeUs: 'Nous écrire',
    coords: 'Vos coordonnées',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    emailNote: '(facultatif, pour recevoir une confirmation)',
    country: 'Pays',
    countries: [
      ['FR', 'France'],
      ['CD', 'République démocratique du Congo'],
      ['BE', 'Belgique'],
      ['', 'Autre']
    ],
    newsletterOptIn: 'Je souhaite recevoir des nouvelles du terrain, quelques fois par an.',
    newsletterNeedsEmail: '(indiquez votre e-mail ci-dessus)',
    newsletterSent: "Un e-mail vient de vous être envoyé pour confirmer votre inscription aux nouvelles du terrain.",
    currencyNote: 'Votre don est payé dans la devise choisie, sans conversion.',
    cardSoonTag: 'Bientôt',
    cardSoonNote: 'Le paiement par carte sera bientôt disponible. En attendant, le virement bancaire est ouvert.',
    thanksTransfer:
      "Merci ! Pensez à indiquer votre nom dans le libellé du virement, pour que nous puissions vous remercier.",
    momoEmail: 'Votre e-mail',
    momoSent: "C’est noté : nous vous préviendrons.",
    momoFallbackName: 'Donateur (Mobile Money)',
    momoSubject: 'Mobile Money — me prévenir',
    momoMessage: (phone: string) =>
      `Merci de me prévenir quand le don par Mobile Money sera disponible. Téléphone : ${phone}`,
    impact: '≈ 100 enfants accueillis chaque semaine au centre (2024)',
    transferTrust: "Virement direct sur le compte de notre association",
    payMethod: 'Moyen de paiement',
    methods: {
      card: { t: 'Carte bancaire ou prélèvement SEPA', d: 'Via Stripe, en quelques instants', tag: 'Recommandé' },
      momo: { t: 'Mobile Money', d: 'Orange Money, Airtel Money, M-Pesa', tag: 'Bientôt' },
      virement: { t: 'Virement bancaire', d: 'Ponctuel ou récurrent, depuis votre banque', tag: 'IBAN' }
    } as Record<Method, { t: string; d: string; tag: string }>,
    holder: 'Titulaire',
    iban: 'IBAN',
    bic: 'BIC',
    copy: "Copier l’IBAN",
    copied: 'IBAN copié',
    virementNoteVillage: 'Pour que votre don aille au One Love Village, indiquez « One Love Village » dans le libellé du virement.',
    virementNote: 'Indiquez votre nom dans le libellé du virement, pour que nous puissions vous remercier.',
    momoNote: 'Orange Money, Airtel Money et M-Pesa seront bientôt disponibles pour les donateurs en RDC. Laissez votre numéro et votre e-mail pour être prévenu.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Me prévenir',
    stripeNote: 'Paiement sécurisé par Stripe. Vous serez redirigé vers une page de paiement chiffrée.',
    back: 'Retour',
    next: 'Continuer',
    pay: (label: string, monthly: boolean) => `Payer ${label}${monthly ? ' / mois' : ''}`,
    notedCoords: "J’ai noté les coordonnées",
    chooseOther: 'Choisir un autre moyen',
    summary: 'Récapitulatif',
    perMonth: 'par mois',
    monthUnit: 'mois',
    once: 'une fois',
    eqConfirm: (eq: string) => `${eq} (équivalence indicative)`,
    genericThanks: 'Merci : chaque euro rejoint directement les programmes de terrain.',
    allocation: 'Raison du don :',
    encrypted: 'Paiement chiffré par Stripe, confirmation par e-mail',
    editable: 'Don mensuel modifiable à tout moment',
    badge: 'Association loi 1901 · RNA W951001528',
    question: 'Une question ? Écrivez-nous',
    error: 'Une erreur est survenue. Merci de réessayer.'
  },
  en: {
    steps: ['Amount', 'Your details', 'Payment'],
    yourGift: 'Your gift',
    frequency: 'Frequency',
    freqs: { once: 'One-off', month: 'Monthly' },
    amount: 'Amount',
    amounts: [
      [10, 'A notebook and pencils for a child, for a term.'],
      [25, 'A month of materials for a workshop group.'],
      [50, 'A medical check-up and follow-up.'],
      [100, 'A month of training for a facilitator.']
    ] as const,
    customLabel: 'Or choose your amount',
    customPlaceholder: 'Other amount',
    reasonTitle: 'Why are you giving?',
    reasons: {
      association: { t: 'A gift to the association', d: 'Used where the children’s needs are greatest.' },
      village: { t: 'Support the One Love Village project', d: 'Your gift goes entirely to building the Kasangulu centre.' },
      parrainage: { t: 'Sponsor a child', d: 'A monthly commitment. As soon as you pay, you join our sponsors.' }
    } as Record<DonationReason, { t: string; d: string }>,
    planTitle: 'Your sponsorship plan',
    planNames: ['Education', 'Education and health', 'Full support'],
    sponsorMonthly: 'Sponsorship is monthly. You can change or stop it at any time.',
    sponsorFrom: (m: string) => `These plans are a guide, not a minimum: you can sponsor from ${m} a month.`,
    sponsorCustomLabel: 'Or choose your monthly amount',
    sponsorEmailNote: '(required, to receive news of your sponsored child)',
    phone: 'Phone or WhatsApp',
    optional: '(optional)',
    charterPre: 'I have read the ',
    charterLink: 'child protection charter',
    charterPost: ' and agree to follow it.',
    required: 'This field is required.',
    emailInvalid: "This email address doesn't look valid.",
    charterRequired: 'Please accept the charter to become a sponsor.',
    sponsorCardOnly:
      'Sponsorship is paid by card (or SEPA direct debit in euros): that is what adds you to our sponsors automatically. To sponsor by standing bank transfer, write to us.',
    sponsorPay: (label: string) => `Pay and become a sponsor · ${label} / month`,
    sponsorThanks: 'As soon as your payment is confirmed, we write to you with all the information about your sponsored child.',
    writeUs: 'Write to us',
    coords: 'Your details',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    emailNote: '(optional, to receive a confirmation)',
    country: 'Country',
    countries: [
      ['FR', 'France'],
      ['CD', 'Democratic Republic of the Congo'],
      ['BE', 'Belgium'],
      ['', 'Other']
    ],
    newsletterOptIn: 'I would like to receive news from the field, a few times a year.',
    newsletterNeedsEmail: '(enter your email above)',
    newsletterSent: 'We have just sent you an email to confirm your subscription to news from the field.',
    currencyNote: 'Your gift is paid in the currency you choose, with no conversion.',
    cardSoonTag: 'Coming soon',
    cardSoonNote: 'Card payment will be available soon. In the meantime, bank transfer is open.',
    thanksTransfer:
      'Thank you! Please put your name in the transfer reference so that we can thank you.',
    momoEmail: 'Your email',
    momoSent: "Noted: we’ll let you know.",
    momoFallbackName: 'Donor (Mobile Money)',
    momoSubject: 'Mobile Money — notify me',
    momoMessage: (phone: string) =>
      `Please let me know when giving by Mobile Money is available. Phone: ${phone}`,
    impact: '≈ 100 children welcomed at the centre every week (2024)',
    transferTrust: "Direct transfer to our association’s account",
    payMethod: 'Payment method',
    methods: {
      card: { t: 'Card or SEPA direct debit', d: 'Via Stripe, in a few moments', tag: 'Recommended' },
      momo: { t: 'Mobile Money', d: 'Orange Money, Airtel Money, M-Pesa', tag: 'Coming soon' },
      virement: { t: 'Bank transfer', d: 'One-off or recurring, from your bank', tag: 'IBAN' }
    } as Record<Method, { t: string; d: string; tag: string }>,
    holder: 'Account holder',
    iban: 'IBAN',
    bic: 'BIC',
    copy: 'Copy IBAN',
    copied: 'IBAN copied',
    virementNoteVillage: 'So that your gift goes to the One Love Village, write “One Love Village” in the transfer reference.',
    virementNote: 'Please put your name in the transfer reference, so that we can thank you.',
    momoNote: 'Orange Money, Airtel Money and M-Pesa will soon be available for donors in the DRC. Leave your number and email to be notified.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Notify me',
    stripeNote: 'Secure payment via Stripe. You will be redirected to an encrypted payment page.',
    back: 'Back',
    next: 'Continue',
    pay: (label: string, monthly: boolean) => `Pay ${label}${monthly ? ' / month' : ''}`,
    notedCoords: "I’ve noted the details",
    chooseOther: 'Choose another method',
    summary: 'Summary',
    perMonth: 'per month',
    monthUnit: 'month',
    once: 'once',
    eqConfirm: (eq: string) => `${eq} (indicative equivalent)`,
    genericThanks: 'Thank you: every euro goes directly to our field programmes.',
    allocation: 'Reason for giving:',
    encrypted: 'Encrypted payment via Stripe, confirmation by email',
    editable: 'Monthly gift, editable at any time',
    badge: 'Registered non-profit (France) · RNA W951001528',
    question: 'A question? Write to us',
    error: 'Something went wrong. Please try again.'
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `cardEnabled` vient du serveur (clé Stripe présente ou non). Tant que Stripe
 * n'est pas branché, la carte reste visible mais marquée « Bientôt » et le
 * virement est présélectionné — avant, la carte était présélectionnée et
 * « Recommandée », et le donateur ne découvrait qu'au dernier clic, après
 * trois étapes, que le paiement n'était pas activé (audit du 27/09/2026).
 */
export function DonationFlow({
  locale,
  cardEnabled,
  sponsorPrices
}: {
  locale: Locale;
  cardEnabled: boolean;
  /** Prix des trois formules de parrainage, lus côté serveur (lib/sponsorship.ts). */
  sponsorPrices: Record<Currency, number>[];
}) {
  const id = useId();
  const t = T[locale];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [freq, setFreq] = useState<'once' | 'month'>('month');
  const [cur, setCur] = useState<Currency>('EUR');
  const [amt, setAmt] = useState(1);
  const [custom, setCustom] = useState('');
  // Raison du don, choisie en premier (08/10/2026) : association, village ou
  // parrainage. Un lien « Soutenir ce projet » arrive avec ?affectation=…
  // et la présélectionne ; le visiteur peut toujours changer.
  const [reason, setReason] = useState<DonationReason>('association');
  // Lecture de l'adresse après l'affichage (page statique : le serveur ne
  // connaît pas les paramètres). Un seul passage, au chargement.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromLink = reasonFromParam(params.get('affectation'));
    if (fromLink) setReason(fromLink);
    // Depuis la page Parrainer : formule et devise déjà choisies là-bas.
    const formuleParam = params.get('formule');
    const formule = formuleParam === null ? NaN : Number(formuleParam);
    if (fromLink === 'parrainage' && Number.isInteger(formule) && formule >= 0 && formule <= 2) setAmt(formule);
    const devise = params.get('devise');
    if (devise === 'EUR' || devise === 'USD' || devise === 'CDF') setCur(devise);
    if (fromLink === 'parrainage') setMethod('card');
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const isSponsor = reason === 'parrainage';
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [charter, setCharter] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'firstName' | 'lastName' | 'email' | 'charter', string>>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [country, setCountry] = useState('FR');
  const [newsletter, setNewsletter] = useState(false);
  const [method, setMethod] = useState<Method>(cardEnabled ? 'card' : 'virement');
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneSent, setPhoneSent] = useState(false);
  const [momoPending, setMomoPending] = useState(false);
  const [momoError, setMomoError] = useState('');
  const [transferDone, setTransferDone] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const emailOk = EMAIL_RE.test(donorEmail.trim());

  // Le parrainage est toujours mensuel ; les montants proposés sont alors les
  // trois formules (amt = indice de la formule), sinon les dons suggérés.
  const monthly = isSponsor || freq === 'month';
  const presetValue = (i: number) => (isSponsor ? sponsorPrices[i]?.[cur] ?? 0 : PRESETS[cur][i]);
  const limits = isSponsor ? SPONSOR_LIMITS : DONATION_LIMITS;
  const isCustom = amt === -1;
  const cVal = parseFloat(custom.replace(',', '.'));
  const valid = isCustom ? cVal >= limits[cur].min && cVal <= limits[cur].max : true;
  const amountStr = isCustom
    ? cVal > 0
      ? formatCustom(cVal, cur, locale)
      : '—'
    : formatMoney(presetValue(amt), cur, locale);
  // Montant réellement versé : celui affiché, dans la devise choisie.
  const amount = isCustom ? (cVal > 0 ? cVal : 0) : presetValue(amt);
  const payLabel = amountStr;
  const projectSlug = reason === 'village' ? VILLAGE_SLUG : undefined;
  // Parrainage : carte (ou SEPA) uniquement, c'est le paiement confirmé qui
  // inscrit le parrain. Pas d'étiquette « Bientôt » sur ce parcours
  // (décision du 29/09/2026) : si Stripe n'est pas branché, le serveur répond
  // « momentanément indisponible ».
  const cardUsable = method === 'card' && (cardEnabled || isSponsor);

  function chooseReason(next: DonationReason) {
    setReason(next);
    setFieldErrors({});
    setError('');
    if (next === 'parrainage') {
      setMethod('card');
      // Garde un montant libre valide, sinon revient à la formule du milieu.
      if (amt > 2) setAmt(1);
    }
  }

  /** Coordonnées obligatoires pour un parrain : nom, prénom, e-mail, charte. */
  function sponsorErrors() {
    const out: typeof fieldErrors = {};
    if (!firstName.trim()) out.firstName = t.required;
    if (!lastName.trim()) out.lastName = t.required;
    if (!donorEmail.trim()) out.email = t.required;
    else if (!emailOk) out.email = t.emailInvalid;
    if (!charter) out.charter = t.charterRequired;
    return out;
  }

  async function startSponsorship() {
    setPending(true);
    setError('');
    await subscribeNewsletter();
    try {
      const response = await fetch('/api/parrainer/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: donorEmail.trim(),
          phone: sponsorPhone.trim(),
          mode: 'child',
          plan: isCustom ? 1 : amt,
          currency: cur,
          locale,
          from: 'dons',
          ...(isCustom ? { amount: cVal } : {})
        })
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 && typeof data.url === 'string') {
        window.location.href = data.url;
        return;
      }
      setError(data.error || t.error);
    } catch {
      setError(t.error);
    }
    setPending(false);
  }

  function chooseMethod(next: Method) {
    setMethod(next);
    setTransferDone(false);
    setError('');
  }

  /** Inscription aux nouvelles du terrain si la case a été cochée — en double
   * opt-in comme depuis le pied de page. Avant, la case était affichée mais
   * rien n'était jamais envoyé (audit du 27/09/2026). */
  async function subscribeNewsletter(): Promise<boolean> {
    if (!newsletter || !emailOk) return false;
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: donorEmail.trim(), firstName: firstName.trim() || undefined, source: 'don' })
      });
      return response.status === 201;
    } catch {
      return false;
    }
  }

  async function notifyMobileMoney() {
    setMomoPending(true);
    setMomoError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`.trim() || t.momoFallbackName,
          email: donorEmail.trim(),
          phone: phone.trim(),
          subject: t.momoSubject,
          message: t.momoMessage(phone.trim()),
          origin: 'mobile-money'
        })
      });
      if (response.status === 201) {
        setPhoneSent(true);
      } else {
        const data = await response.json().catch(() => ({}));
        setMomoError(data.error || t.error);
      }
    } catch {
      setMomoError(t.error);
    } finally {
      setMomoPending(false);
    }
  }

  function copyIban() {
    try {
      navigator.clipboard.writeText(bankTransfer.iban);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission
      // refusée) : l'IBAN reste affiché à l'écran, la copie manuelle marche.
    }
    setCopied(true);
  }

  async function goNext() {
    if (step === 2 && isSponsor) {
      const errs = sponsorErrors();
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) {
        document.getElementById(`${id}-${Object.keys(errs)[0]}`)?.focus();
        return;
      }
    }
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
      return;
    }
    if (isSponsor) {
      await startSponsorship();
      return;
    }
    if (method === 'virement') {
      setPending(true);
      setNewsletterSent(await subscribeNewsletter());
      setTransferDone(true);
      setPending(false);
      return;
    }
    if (!cardUsable) {
      // Carte pas encore activée, ou Mobile Money : le bouton propose de
      // passer au virement plutôt que de ne rien faire.
      chooseMethod('virement');
      return;
    }
    setPending(true);
    setError('');
    await subscribeNewsletter();
    const message = await startStripeCheckout({
      amount,
      currency: cur,
      frequency: monthly ? 'monthly' : 'once',
      projectSlug,
      donorEmail: emailOk ? donorEmail.trim() : undefined,
      donorFirstName: firstName.trim() || undefined,
      donorLastName: lastName.trim() || undefined,
      donorCountry: country || undefined,
      locale
    });
    if (message) {
      setError(message);
      setPending(false);
    }
  }

  const noNext = !valid;

  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
      <div className="grid grid-cols-1 gap-10 dk:grid-cols-[2fr_1fr] dk:items-start">
        {/* Colonne formulaire */}
        <div className="flex flex-col gap-8">
          {/* Étapes */}
          <ol aria-label={t.steps.join(', ')} className="flex list-none gap-3 p-0">
            {t.steps.map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const done = n < step;
              const cur = n === step;
              return (
                <li key={label} className="flex flex-1 flex-col gap-2">
                  <div className={`h-1 rounded-full ${n <= step ? 'bg-copper-600' : 'bg-card-line'}`} />
                  <button
                    type="button"
                    disabled={n > step}
                    onClick={() => n < step && setStep(n)}
                    aria-current={cur ? 'step' : undefined}
                    className={`inline-flex min-h-11 items-center gap-1.5 border-0 bg-transparent p-0 text-left text-[13px] font-bold ${
                      n <= step ? 'cursor-pointer text-ink' : 'cursor-default text-taupe'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-extrabold ${
                        cur ? 'bg-copper-600 text-white' : done ? 'bg-sage-700 text-white' : 'bg-card-line text-ink-soft'
                      }`}
                    >
                      {done ? <CheckIcon size={12} weight="bold" aria-hidden /> : n}
                    </span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Étape 1 — Montant */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="m-0 font-serif text-[26px] font-semibold">{t.yourGift}</h2>
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-[15px] font-bold">{t.reasonTitle}</legend>
                {(Object.keys(t.reasons) as DonationReason[]).map((k) => (
                  <label
                    key={k}
                    className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 ${
                      reason === k ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${id}-reason`}
                      checked={reason === k}
                      onChange={() => chooseReason(k)}
                      className="mt-1 min-h-0 accent-copper-600"
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold">{t.reasons[k].t}</span>
                      <span className="text-[13px] leading-[1.4] text-ink-soft">{t.reasons[k].d}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              {isSponsor ? (
                <p className="m-0 flex items-center gap-2 rounded-lg bg-sand px-4 py-3 text-[14px] text-ink-body">
                  <ArrowsClockwiseIcon size={18} className="flex-none text-copper-600" aria-hidden />
                  {t.sponsorMonthly}
                </p>
              ) : (
              <div role="radiogroup" aria-label={t.frequency} className="grid grid-cols-2 rounded-full bg-sand p-1 dk:max-w-xs">
                {(['once', 'month'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={freq === k}
                    onClick={() => setFreq(k)}
                    className={`min-h-11 cursor-pointer rounded-full border-0 text-[15px] font-bold text-ink ${
                      freq === k ? 'bg-white shadow-ol-xs' : 'bg-transparent'
                    }`}
                  >
                    {t.freqs[k]}
                  </button>
                ))}
              </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-bold">{isSponsor ? t.planTitle : t.amount}</span>
                <div className="flex gap-1">
                  {(['EUR', 'USD', 'CDF'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={cur === c}
                      onClick={() => setCur(c)}
                      className={`min-h-11 min-w-12 cursor-pointer rounded-md border-[1.5px] px-2.5 text-[13px] font-bold ${
                        cur === c ? 'border-ink bg-ink text-cream' : 'border-field-line bg-white text-ink'
                      }`}
                    >
                      {SYMBOL[c]}
                    </button>
                  ))}
                </div>
              </div>
              {isSponsor ? (
                <div role="radiogroup" aria-label={t.planTitle} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {t.planNames.map((name, i) => (
                    <button
                      key={name}
                      type="button"
                      role="radio"
                      aria-checked={amt === i}
                      onClick={() => setAmt(i)}
                      className={`flex min-h-[84px] cursor-pointer flex-col items-start gap-1 rounded-xl border-2 px-3.5 py-3 text-left ${
                        amt === i ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                      }`}
                    >
                      <span className="text-[14px] font-bold text-ink-soft">{name}</span>
                      <span className="text-[22px] font-extrabold text-ink">
                        {formatMoney(presetValue(i), cur, locale)}
                        <span className="text-[14px] font-bold text-ink-soft"> / {t.monthUnit}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
              <div role="radiogroup" aria-label={t.amount} className="grid grid-cols-2 gap-2.5">
                {t.amounts.map(([v, eq], i) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={amt === i}
                    onClick={() => setAmt(i)}
                    className={`flex min-h-[84px] cursor-pointer flex-col items-start gap-1 rounded-xl border-2 px-3.5 py-3 text-left ${
                      amt === i ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                    }`}
                  >
                    <span className="text-[22px] font-extrabold text-ink">{formatMoney(PRESETS[cur][i], cur, locale)}</span>
                    <span className="text-[13px] leading-[1.35] text-ink-soft">{eq}</span>
                  </button>
                ))}
              </div>
              )}
              <p className="-mt-3 m-0 text-[13px] text-ink-soft">
                {isSponsor ? t.sponsorFrom(formatMoney(SPONSOR_FROM[cur], cur, locale)) : t.currencyNote}
              </p>
              <label className="flex flex-col gap-2">
                <span className="text-[15px] font-bold">{isSponsor ? t.sponsorCustomLabel : t.customLabel}</span>
                <div
                  className={`ol-amount-box flex min-h-14 items-center gap-2 rounded-xl border-2 px-4 ${
                    isCustom ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                  }`}
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    aria-label={t.customLabel}
                    placeholder={t.customPlaceholder}
                    value={custom}
                    onChange={(e) => {
                      setCustom(sanitizeAmount(e.target.value));
                      setAmt(-1);
                    }}
                    onFocus={() => setAmt(-1)}
                    className="ol-amount-input min-w-0 flex-1 border-0 bg-transparent text-[20px] font-extrabold text-ink outline-none"
                  />
                  <span className="text-[17px] font-extrabold text-ink-soft">{SYMBOL[cur]}</span>
                </div>
              </label>

            </div>
          )}

          {/* Étape 2 — Coordonnées */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="m-0 font-serif text-[26px] font-semibold">{t.coords}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[14px] font-bold">{t.firstName}</span>
                  <input
                    id={`${id}-firstName`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={120}
                    autoComplete="given-name"
                    required={isSponsor}
                    aria-invalid={Boolean(fieldErrors.firstName)}
                    aria-describedby={fieldErrors.firstName ? `${id}-firstName-err` : undefined}
                    className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none aria-invalid:border-error"
                  />
                  {fieldErrors.firstName && <span id={`${id}-firstName-err`} className="text-[13px] font-bold text-error">{fieldErrors.firstName}</span>}
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[14px] font-bold">{t.lastName}</span>
                  <input
                    id={`${id}-lastName`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={120}
                    autoComplete="family-name"
                    required={isSponsor}
                    aria-invalid={Boolean(fieldErrors.lastName)}
                    aria-describedby={fieldErrors.lastName ? `${id}-lastName-err` : undefined}
                    className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none aria-invalid:border-error"
                  />
                  {fieldErrors.lastName && <span id={`${id}-lastName-err`} className="text-[13px] font-bold text-error">{fieldErrors.lastName}</span>}
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-bold">
                  {t.email} <span className="font-normal text-ink-soft">{isSponsor ? t.sponsorEmailNote : t.emailNote}</span>
                </span>
                <input
                  id={`${id}-email`}
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  maxLength={180}
                  autoComplete="email"
                  required={isSponsor}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${id}-email-err` : undefined}
                  className="min-h-12 w-full max-w-sm rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none aria-invalid:border-error"
                />
                {fieldErrors.email && <span id={`${id}-email-err`} className="text-[13px] font-bold text-error">{fieldErrors.email}</span>}
              </label>
              {isSponsor && (
                <label className="flex max-w-sm flex-col gap-1.5">
                  <span className="text-[14px] font-bold">
                    {t.phone} <span className="font-normal text-ink-soft">{t.optional}</span>
                  </span>
                  <input
                    type="tel"
                    value={sponsorPhone}
                    onChange={(e) => setSponsorPhone(e.target.value)}
                    maxLength={40}
                    autoComplete="tel"
                    className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                  />
                </label>
              )}
              <label className="flex max-w-xs flex-col gap-1.5">
                <span className="text-[14px] font-bold">{t.country}</span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                >
                  {t.countries.map(([code, label]) => (
                    <option key={label} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {isSponsor && (
                <div className="flex flex-col gap-1.5">
                  <label className="flex min-h-0 cursor-pointer items-start gap-2.5">
                    <input
                      id={`${id}-charter`}
                      type="checkbox"
                      checked={charter}
                      onChange={(e) => setCharter(e.target.checked)}
                      aria-invalid={Boolean(fieldErrors.charter)}
                      aria-describedby={fieldErrors.charter ? `${id}-charter-err` : undefined}
                      className="mt-0.5 h-[22px] min-h-0 w-[22px] flex-none accent-copper-600"
                    />
                    <span className="text-[15px] leading-[1.4]">
                      {t.charterPre}
                      <a href={`${localeHref('/parrainer', locale)}#charte`} target="_blank" rel="noopener" className="font-bold text-copper-700 underline">
                        {t.charterLink}
                      </a>
                      {t.charterPost}
                    </span>
                  </label>
                  {fieldErrors.charter && <span id={`${id}-charter-err`} className="text-[13px] font-bold text-error">{fieldErrors.charter}</span>}
                </div>
              )}
              <label className={`flex min-h-0 items-start gap-2.5 ${emailOk ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  checked={newsletter && emailOk}
                  disabled={!emailOk}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 h-[22px] min-h-0 w-[22px] flex-none accent-copper-600"
                />
                <span className="text-[15px] leading-[1.4]">
                  {t.newsletterOptIn}
                  {!emailOk && <span className="ml-1 text-ink-soft">{t.newsletterNeedsEmail}</span>}
                </span>
              </label>
            </div>
          )}

          {/* Étape 3 — Paiement */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="m-0 font-serif text-[26px] font-semibold">{t.payMethod}</h2>
              <div className="flex flex-col gap-2.5">
                {(isSponsor ? (['card'] as Method[]) : (Object.keys(t.methods) as Method[])).map((k) => {
                  const m = t.methods[k];
                  const recommended = k === 'card' && (cardEnabled || isSponsor);
                  const tag = k === 'card' && !cardEnabled && !isSponsor ? t.cardSoonTag : m.tag;
                  const Icon = k === 'card' ? CreditCardIcon : k === 'momo' ? DeviceMobileIcon : BankIcon;
                  return (
                    <label
                      key={k}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 ${
                        method === k ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${id}-method`}
                        checked={method === k}
                        onChange={() => chooseMethod(k)}
                        className="min-h-0 accent-copper-600"
                      />
                      <Icon size={22} className="text-ink-soft" aria-hidden />
                      <span className="flex flex-1 flex-col">
                        <span className="text-[15px] font-bold">{m.t}</span>
                        <span className="text-[13px] text-ink-soft">{m.d}</span>
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
                          recommended ? 'bg-sage-100 text-sage-700' : 'bg-sand text-copper-700'
                        }`}
                      >
                        {tag}
                      </span>
                    </label>
                  );
                })}
              </div>

              {method === 'card' &&
                (isSponsor ? (
                  <p className="m-0 text-[14px] leading-[1.55] text-ink-body">
                    {t.sponsorCardOnly}{' '}
                    <Link href={localeHref('/contact', locale)} className="font-bold text-copper-700 underline">
                      {t.writeUs}
                    </Link>
                  </p>
                ) : (
                  <p className="m-0 text-[13px] text-ink-soft">{cardEnabled ? t.stripeNote : t.cardSoonNote}</p>
                ))}

              {method === 'virement' && (
                <div className="flex flex-col gap-4 rounded-xl bg-sand p-6">
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">{t.holder}</dt>
                      <dd className="m-0 mt-1 font-bold">{bankTransfer.holder}</dd>
                    </div>
                    <div>
                      <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">{t.iban}</dt>
                      <dd className="m-0 mt-1 font-mono text-[14px] font-bold tracking-wide">{bankTransfer.iban}</dd>
                    </div>
                    <div>
                      <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">{t.bic}</dt>
                      <dd className="m-0 mt-1 font-mono text-[14px] font-bold tracking-wide">{bankTransfer.bic}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={copyIban}
                    className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border-2 border-copper-600 bg-transparent px-4 text-[14px] font-bold text-copper-700"
                  >
                    {copied ? <CheckIcon size={16} aria-hidden /> : <CopyIcon size={16} aria-hidden />}
                    {copied ? t.copied : t.copy}
                  </button>
                  <p className="m-0 text-[13px] text-ink-soft">{reason === 'village' ? t.virementNoteVillage : t.virementNote}</p>
                  {transferDone && (
                    <div role="status" className="flex flex-col gap-1.5 rounded-lg bg-white p-4 text-[14px] leading-[1.5] text-ink">
                      <span className="flex items-start gap-2 font-bold">
                        <CheckIcon size={18} className="mt-0.5 flex-none text-sage-700" aria-hidden />
                        {t.thanksTransfer}
                      </span>
                      {newsletterSent && <span className="pl-[26px] text-ink-soft">{t.newsletterSent}</span>}
                    </div>
                  )}
                </div>
              )}

              {method === 'momo' && (
                <div className="flex flex-col gap-4 rounded-xl bg-sand p-6">
                  <p className="m-0 text-[14px] leading-[1.6] text-ink-body">{t.momoNote}</p>
                  {phoneSent ? (
                    <p role="status" className="m-0 flex items-center gap-2 text-[14px] font-bold text-ink">
                      <CheckIcon size={18} className="text-sage-700" aria-hidden />
                      {t.momoSent}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex flex-wrap gap-2.5">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={40}
                          autoComplete="tel"
                          aria-label={t.phonePlaceholder}
                          placeholder={t.phonePlaceholder}
                          className="min-h-12 min-w-0 flex-1 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                        />
                        <input
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          maxLength={180}
                          autoComplete="email"
                          aria-label={t.momoEmail}
                          placeholder={t.momoEmail}
                          className="min-h-12 min-w-0 flex-1 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!phone.trim() || !emailOk || momoPending}
                        onClick={notifyMobileMoney}
                        className="min-h-12 w-fit cursor-pointer rounded-full border-0 bg-copper-600 px-5 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {momoPending ? '…' : t.notifyMe}
                      </button>
                      {momoError && (
                        <p role="alert" className="m-0 text-[14px] font-bold text-error">
                          {momoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p role="alert" className="m-0 text-[14px] font-bold text-error">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 border-t border-card-line pt-6">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
              aria-label={t.back}
              className={`min-h-12 cursor-pointer rounded-full border-2 border-card-line bg-transparent px-5 text-[15px] font-bold text-ink ${
                step === 1 ? 'opacity-35' : 'opacity-100'
              }`}
            >
              {t.back}
            </button>
            {!(step === 3 && method === 'virement' && transferDone) && (
              <button
                type="button"
                disabled={noNext || pending}
                onClick={goNext}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-0 bg-copper-600 px-6 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-disabled"
              >
                {step < 3 ? (
                  <>
                    {t.next}
                    <ArrowRightIcon aria-hidden />
                  </>
                ) : cardUsable ? (
                  <>
                    <LockSimpleIcon aria-hidden />
                    {pending ? '…' : isSponsor ? t.sponsorPay(payLabel) : t.pay(payLabel, monthly)}
                  </>
                ) : method === 'virement' ? (
                  <>
                    <CheckIcon aria-hidden />
                    {pending ? '…' : t.notedCoords}
                  </>
                ) : (
                  <>
                    <ArrowsClockwiseIcon aria-hidden />
                    {t.chooseOther}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Récapitulatif — sticky */}
        <div className="flex flex-col gap-4 rounded-card bg-night relative p-7 text-cream dk:sticky dk:top-[100px]">
              <span className="ol-beam" aria-hidden />
          <h3 className="m-0 font-serif text-[20px] font-semibold">{t.summary}</h3>
          <div>
            <span className="block font-serif text-[36px] font-semibold leading-none">{amountStr}</span>
            <span className="text-[14px] text-on-dark-2">{monthly ? t.perMonth : t.once}</span>
          </div>
          <p className="m-0 text-[14px] leading-[1.5] text-on-dark-1">
            {isSponsor ? t.sponsorThanks : isCustom ? t.genericThanks : t.eqConfirm(t.amounts[amt]?.[1] ?? '')}
          </p>
          <div className="border-t border-dark-line pt-4 text-[14px] text-on-dark-1">
            <span className="text-on-dark-2">{t.allocation}</span> {t.reasons[reason].t}
            {isSponsor && !isCustom && <span className="block text-on-dark-2">{t.planNames[amt]}</span>}
          </div>
          <div className="flex flex-col gap-2 border-t border-dark-line pt-4 text-[13px] text-on-dark-2">
            <span className="flex items-center gap-2">
              <UsersThreeIcon size={16} aria-hidden />
              {t.impact}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheckIcon size={16} aria-hidden />
              {cardUsable ? t.encrypted : t.transferTrust}
            </span>
            {monthly && (
              <span className="flex items-center gap-2">
                <ArrowsClockwiseIcon size={16} aria-hidden />
                {t.editable}
              </span>
            )}
          </div>
          <div className="border-t border-dark-line pt-4 text-[13px] text-on-dark-3">
            <p className="m-0">{t.badge}</p>
            <Link href={localeHref('/contact', locale)} className="inline-flex min-h-11 items-center text-on-dark-2 underline">
              {t.question}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
