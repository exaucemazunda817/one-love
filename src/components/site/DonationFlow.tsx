'use client';

import { useId, useState } from 'react';
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
  formatFromEur,
  formatCustom,
  toEur,
  sanitizeAmount,
  startStripeCheckout
} from '@/lib/donation-ui';
import { bankTransfer, currentProject } from '@/lib/content';

type Dest = 'besoins' | 'reves' | 'sante';
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
      [25, "Un mois de matériel pour un groupe d'atelier."],
      [50, 'Une consultation médicale et son suivi.'],
      [100, "Un mois de formation pour un animateur."]
    ] as const,
    customLabel: 'Ou choisissez votre montant',
    customPlaceholder: 'Autre montant',
    allocate: 'Affecter mon don',
    dest: {
      besoins: 'Là où les besoins sont les plus importants',
      reves: `Programme ${currentProject.name}`,
      sante: 'Suivi médical et psychosocial'
    } as Record<Dest, string>,
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
    convertedNote: 'Montants convertis à titre indicatif : le don est versé en euros.',
    chargedEur: (eur: string) => `Soit environ ${eur}, versés en euros`,
    cardSoonTag: 'Bientôt',
    cardSoonNote: 'Le paiement par carte sera bientôt disponible. En attendant, le virement bancaire est ouvert.',
    thanksTransfer:
      "Merci ! Pensez à indiquer votre nom dans le libellé du virement, pour que nous puissions vous remercier.",
    momoEmail: 'Votre e-mail',
    momoSent: "C'est noté : nous vous préviendrons.",
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
    copy: "Copier l'IBAN",
    copied: 'IBAN copié',
    virementNote: `Pour soutenir un programme en particulier, comme ${currentProject.name}, indiquez-le dans le libellé du virement.`,
    momoNote: 'Orange Money, Airtel Money et M-Pesa seront bientôt disponibles pour les donateurs en RDC. Laissez votre numéro et votre e-mail pour être prévenu.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Me prévenir',
    stripeNote: 'Paiement sécurisé par Stripe. Vous serez redirigé vers une page de paiement chiffrée.',
    back: 'Retour',
    next: 'Continuer',
    pay: (label: string, monthly: boolean) => `Payer ${label}${monthly ? ' / mois' : ''}`,
    notedCoords: "J'ai noté les coordonnées",
    chooseOther: 'Choisir un autre moyen',
    summary: 'Récapitulatif',
    perMonth: 'par mois',
    once: 'une fois',
    eqConfirm: (eq: string) => `${eq} (équivalence indicative)`,
    genericThanks: 'Merci : chaque euro rejoint directement les programmes de terrain.',
    allocation: 'Affectation :',
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
    allocate: 'Direct my gift',
    dest: {
      besoins: 'Where the need is greatest',
      reves: `${currentProject.name} programme`,
      sante: 'Medical and psychosocial care'
    } as Record<Dest, string>,
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
    convertedNote: 'Amounts converted for guidance only: your gift is paid in euros.',
    chargedEur: (eur: string) => `That is about ${eur}, paid in euros`,
    cardSoonTag: 'Coming soon',
    cardSoonNote: 'Card payment will be available soon. In the meantime, bank transfer is open.',
    thanksTransfer:
      'Thank you! Please put your name in the transfer reference so that we can thank you.',
    momoEmail: 'Your email',
    momoSent: "Noted: we'll let you know.",
    momoFallbackName: 'Donor (Mobile Money)',
    momoSubject: 'Mobile Money — notify me',
    momoMessage: (phone: string) =>
      `Please let me know when giving by Mobile Money is available. Phone: ${phone}`,
    impact: '≈ 100 children welcomed at the centre every week (2024)',
    transferTrust: "Direct transfer to our association's account",
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
    virementNote: `To support a specific programme, such as ${currentProject.name}, mention it in the transfer reference.`,
    momoNote: 'Orange Money, Airtel Money and M-Pesa will soon be available for donors in the DRC. Leave your number and email to be notified.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Notify me',
    stripeNote: 'Secure payment via Stripe. You will be redirected to an encrypted payment page.',
    back: 'Back',
    next: 'Continue',
    pay: (label: string, monthly: boolean) => `Pay ${label}${monthly ? ' / month' : ''}`,
    notedCoords: "I've noted the details",
    chooseOther: 'Choose another method',
    summary: 'Summary',
    perMonth: 'per month',
    once: 'once',
    eqConfirm: (eq: string) => `${eq} (indicative equivalent)`,
    genericThanks: 'Thank you: every euro goes directly to our field programmes.',
    allocation: 'Allocation:',
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
export function DonationFlow({ locale, cardEnabled }: { locale: Locale; cardEnabled: boolean }) {
  const id = useId();
  const t = T[locale];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [freq, setFreq] = useState<'once' | 'month'>('month');
  const [cur, setCur] = useState<Currency>('EUR');
  const [amt, setAmt] = useState(1);
  const [custom, setCustom] = useState('');
  const [dest, setDest] = useState<Dest>('besoins');
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

  const isCustom = amt === -1;
  const cVal = parseFloat(custom.replace(',', '.'));
  const valid = isCustom ? cVal > 0 : true;
  const amountStr = isCustom
    ? cVal > 0
      ? formatCustom(cVal, cur, locale)
      : '—'
    : formatFromEur(t.amounts[amt][0], cur, locale);
  const amountEur = isCustom ? (cVal > 0 ? toEur(cVal, cur) : 0) : t.amounts[amt][0];
  // Montant réellement versé : toujours en euros, quelle que soit la devise
  // d'affichage choisie ($ ou FC ne sont que des conversions indicatives).
  const eurLabel = formatCustom(amountEur, 'EUR', locale);
  const payLabel = cur === 'EUR' ? amountStr : eurLabel;
  const projectSlug = dest === 'reves' ? currentProject.slug : undefined;
  const cardUsable = method === 'card' && cardEnabled;

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
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
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
      amountEur,
      frequency: freq === 'month' ? 'monthly' : 'once',
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

              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-bold">{t.amount}</span>
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
                    <span className="text-[22px] font-extrabold text-ink">{formatFromEur(v, cur, locale)}</span>
                    <span className="text-[13px] leading-[1.35] text-ink-soft">{eq}</span>
                  </button>
                ))}
              </div>
              {cur !== 'EUR' && <p className="-mt-3 m-0 text-[13px] text-ink-soft">{t.convertedNote}</p>}
              <label className="flex flex-col gap-2">
                <span className="text-[15px] font-bold">{t.customLabel}</span>
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

              <div className="flex flex-col gap-2">
                <span className="text-[15px] font-bold">{t.allocate}</span>
                <div className="flex flex-col gap-2">
                  {(Object.keys(t.dest) as Dest[]).map((k) => (
                    <label
                      key={k}
                      className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border-2 px-4 ${
                        dest === k ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${id}-dest`}
                        checked={dest === k}
                        onChange={() => setDest(k)}
                        className="min-h-0 accent-copper-600"
                      />
                      <span className="text-[15px]">{t.dest[k]}</span>
                    </label>
                  ))}
                </div>
              </div>
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={120}
                    className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[14px] font-bold">{t.lastName}</span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={120}
                    className="min-h-12 rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-bold">
                  {t.email} <span className="font-normal text-ink-soft">{t.emailNote}</span>
                </span>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  maxLength={180}
                  autoComplete="email"
                  className="min-h-12 w-full max-w-sm rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[15px] focus:border-copper-600 focus:outline-none"
                />
              </label>
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
                {(Object.keys(t.methods) as Method[]).map((k) => {
                  const m = t.methods[k];
                  const recommended = k === 'card' && cardEnabled;
                  const tag = k === 'card' && !cardEnabled ? t.cardSoonTag : m.tag;
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

              {method === 'card' && (
                <p className="m-0 text-[13px] text-ink-soft">{cardEnabled ? t.stripeNote : t.cardSoonNote}</p>
              )}

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
                  <p className="m-0 text-[13px] text-ink-soft">{t.virementNote}</p>
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
                    {pending ? '…' : t.pay(payLabel, freq === 'month')}
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
        <div className="flex flex-col gap-4 rounded-card bg-night p-7 text-cream dk:sticky dk:top-[100px]">
          <h3 className="m-0 font-serif text-[20px] font-semibold">{t.summary}</h3>
          <div>
            <span className="block font-serif text-[36px] font-semibold leading-none">{amountStr}</span>
            <span className="text-[14px] text-on-dark-2">{freq === 'month' ? t.perMonth : t.once}</span>
            {cur !== 'EUR' && amountEur > 0 && (
              <span className="mt-1 block text-[13px] text-on-dark-2">{t.chargedEur(eurLabel)}</span>
            )}
          </div>
          <p className="m-0 text-[14px] leading-[1.5] text-on-dark-1">
            {isCustom ? t.genericThanks : t.eqConfirm(t.amounts[amt][1])}
          </p>
          <div className="border-t border-dark-line pt-4 text-[14px] text-on-dark-1">
            <span className="text-on-dark-2">{t.allocation}</span> {t.dest[dest]}
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
            {freq === 'month' && (
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
