'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  CreditCardIcon,
  DeviceMobileIcon,
  BankIcon,
  CheckIcon,
  ArrowRightIcon,
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
  sanitizeAmount
} from '@/lib/donation-ui';
import { DONATION_LIMITS, SPONSOR_FROM, SPONSOR_LIMITS, formatMoney } from '@/lib/money';
import { bankTransfer } from '@/lib/content';
import { VILLAGE_SLUG, reasonFromParam, type DonationReason } from '@/lib/funds';
import { helloAssoWidgetUrl } from '@/lib/helloasso';
import { HelloAssoWidget, type HelloAssoPurchase } from '@/components/site/HelloAssoWidget';

// Montants proposés, FIXÉS dans chaque devise (07/10/2026) : le don est payé
// exactement dans la devise et au montant affichés, sans reconversion. Les
// valeurs en $ et en FC reprennent celles qui s'affichaient déjà. L'ordre
// suit celui des équivalences de T[locale].amounts.
const PRESETS: Record<Currency, readonly number[]> = {
  EUR: [10, 25, 50, 100],
  USD: [11, 28, 55, 110],
  CDF: [31_000, 78_000, 155_000, 310_000]
};
// Carte et prélèvement passent par le formulaire HelloAsso intégré à la page,
// en euros (28/10/2026, Stripe mis de côté) ; virement direct pour les trois
// raisons du don ; Mobile Money reste « bientôt », hors parrainage.
type Method = 'card' | 'virement' | 'momo';

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
    sponsorThanks: 'Dès la confirmation de votre paiement, nous vous écrivons avec toutes les informations sur votre filleul.',
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
    euroOnly: 'La carte et le prélèvement passent par HelloAsso, en euros seulement. Choisissez l’euro, ou le virement bancaire.',
    helloIntro: (amount: string, monthly: boolean) =>
      `Réglez votre don ci-dessous, sans quitter notre site, avec HelloAsso, la plateforme de paiement des associations. Le montant de ${amount} est déjà indiqué${monthly ? ' : choisissez « Mensuel » dans le formulaire' : ''}.`,
    helloTitle: 'Formulaire de don HelloAsso',
    helloTrust: 'Paiement sécurisé par HelloAsso, sans quitter notre site',
    helloThanks: 'Merci ! Votre don est bien enregistré. HelloAsso vous envoie le justificatif de paiement par e-mail.',
    helloSponsorThanks: 'Merci ! Votre paiement est enregistré : nous vous écrivons très vite pour vous présenter votre filleul.',
    getReference: 'Obtenir ma référence de virement',
    referenceTitle: 'Votre référence de virement',
    referenceOnce: (amount: string) => `Faites un virement de ${amount} sur ce compte, en recopiant exactement cette référence dans le libellé.`,
    referenceMonthly: (amount: string) => `Mettez en place un virement permanent de ${amount} par mois sur ce compte, en recopiant exactement cette référence dans le libellé.`,
    referenceWhy: 'C’est cette référence qui range votre don au bon endroit.',
    referenceSponsor: 'Vous devenez parrain ou marraine dès que nous recevons votre premier virement : nous vous écrivons alors avec toutes les informations.',
    thanksTransfer: 'Merci ! Nous confirmons la réception de votre don dès qu’il apparaît sur notre compte.',
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
      card: { t: 'Carte bancaire ou prélèvement', d: 'CB, Visa, Mastercard, Apple Pay ou prélèvement SEPA, via HelloAsso', tag: 'En euros' },
      virement: { t: 'Virement bancaire', d: 'Depuis votre banque, avec une référence à recopier', tag: 'IBAN' },
      momo: { t: 'Mobile Money', d: 'Orange Money, Airtel Money, M-Pesa', tag: 'Bientôt' }
    } as Record<Method, { t: string; d: string; tag: string }>,
    holder: 'Titulaire',
    iban: 'IBAN',
    bic: 'BIC',
    copy: "Copier l’IBAN",
    copied: 'IBAN copié',
    virementNote: 'À l’étape suivante, nous vous donnons une référence unique à recopier dans le libellé du virement : c’est elle qui range votre don au bon endroit.',
    momoNote: 'Orange Money, Airtel Money et M-Pesa seront bientôt disponibles pour les donateurs en RDC. Laissez votre numéro et votre e-mail pour être prévenu.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Me prévenir',
    back: 'Retour',
    next: 'Continuer',
    chooseOther: 'Choisir un autre moyen',
    summary: 'Récapitulatif',
    perMonth: 'par mois',
    monthUnit: 'mois',
    once: 'une fois',
    eqConfirm: (eq: string) => `${eq} (équivalence indicative)`,
    genericThanks: 'Merci : chaque euro rejoint directement les programmes de terrain.',
    allocation: 'Raison du don :',
    editable: 'Don mensuel modifiable à tout moment',
    badge: 'Association loi 1901 · RNA W951001528',
    question: 'Une question ? Écrivez-nous',
    error: 'Une erreur est survenue. Merci de réessayer.',
    referenceReused: 'Vous aviez déjà demandé une référence pour ce don : c’est la même. Ne faites qu’un seul virement.',
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
    sponsorThanks: 'As soon as your payment is confirmed, we write to you with all the information about your sponsored child.',
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
    euroOnly: 'Card and direct debit go through HelloAsso, in euros only. Choose the euro, or bank transfer.',
    helloIntro: (amount: string, monthly: boolean) =>
      `Complete your gift below, without leaving our site, with HelloAsso, the payment platform for associations. The amount of ${amount} is already filled in${monthly ? ': choose “Monthly” in the form' : ''}.`,
    helloTitle: 'HelloAsso donation form',
    helloTrust: 'Secure payment by HelloAsso, without leaving our site',
    helloThanks: 'Thank you! Your gift has been recorded. HelloAsso emails you the payment receipt.',
    helloSponsorThanks: 'Thank you! Your payment is recorded: we will write to you very soon to introduce your sponsored child.',
    getReference: 'Get my transfer reference',
    referenceTitle: 'Your transfer reference',
    referenceOnce: (amount: string) => `Make a transfer of ${amount} to this account, copying this reference exactly into the transfer description.`,
    referenceMonthly: (amount: string) => `Set up a standing transfer of ${amount} a month to this account, copying this reference exactly into the transfer description.`,
    referenceWhy: 'This reference is what directs your gift to the right place.',
    referenceSponsor: 'You become a sponsor as soon as we receive your first transfer: we then write to you with all the information.',
    thanksTransfer: 'Thank you! We confirm receipt of your gift as soon as it reaches our account.',
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
      card: { t: 'Bank card or direct debit', d: 'Visa, Mastercard, Apple Pay or SEPA direct debit, via HelloAsso', tag: 'Euros' },
      virement: { t: 'Bank transfer', d: 'From your bank, with a reference to copy', tag: 'IBAN' },
      momo: { t: 'Mobile Money', d: 'Orange Money, Airtel Money, M-Pesa', tag: 'Coming soon' }
    } as Record<Method, { t: string; d: string; tag: string }>,
    holder: 'Account holder',
    iban: 'IBAN',
    bic: 'BIC',
    copy: 'Copy IBAN',
    copied: 'IBAN copied',
    virementNote: 'At the next step, we give you a unique reference to copy into the transfer description: it directs your gift to the right place.',
    momoNote: 'Orange Money, Airtel Money and M-Pesa will soon be available for donors in the DRC. Leave your number and email to be notified.',
    phonePlaceholder: '+243 …',
    notifyMe: 'Notify me',
    back: 'Back',
    next: 'Continue',
    chooseOther: 'Choose another method',
    summary: 'Summary',
    perMonth: 'per month',
    monthUnit: 'month',
    once: 'once',
    eqConfirm: (eq: string) => `${eq} (indicative equivalent)`,
    genericThanks: 'Thank you: every euro goes directly to our field programmes.',
    allocation: 'Reason for giving:',
    editable: 'Monthly gift, editable at any time',
    badge: 'Registered non-profit (France) · RNA W951001528',
    question: 'A question? Write to us',
    error: 'Something went wrong. Please try again.',
    referenceReused: 'You already asked for a reference for this gift: it is the same one. Please make only one transfer.',
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parcours de don en trois étapes. Carte et prélèvement : formulaire HelloAsso
 * intégré à l'étape 3 (euros seulement), prérempli avec le montant et les
 * coordonnées ; quand HelloAsso signale la fin du paiement, l'association
 * reçoit un message avec la raison du don (village, parrainage…), que
 * HelloAsso ne connaît pas. Virement : référence à recopier, confirmée par
 * l'équipe dans /gestion/virements.
 */
export function DonationFlow({
  locale,
  sponsorPrices
}: {
  locale: Locale;
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
  const [method, setMethod] = useState<Method>('card');
  const [helloPaid, setHelloPaid] = useState<HelloAssoPurchase | null>(null);
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneSent, setPhoneSent] = useState(false);
  const [momoPending, setMomoPending] = useState(false);
  const [momoError, setMomoError] = useState('');
  const [transferDone, setTransferDone] = useState(false);
  // Référence unique du virement (OL-DON-…, OL-VIL-…, OL-PAR-…), donnée par le serveur.
  const [transferRef, setTransferRef] = useState('');
  const [transferReused, setTransferReused] = useState(false);
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
  const projectSlug = reason === 'village' ? VILLAGE_SLUG : undefined;
  // Carte et prélèvement : HelloAsso, en euros uniquement.
  const onlineBlocked = cur !== 'EUR';
  const helloSrc = helloAssoWidgetUrl();
  const showHello = method === 'card' && !onlineBlocked && Boolean(helloSrc);
  const ISO3: Record<string, string> = { FR: 'FRA', CD: 'COD', BE: 'BEL' };

  function chooseReason(next: DonationReason) {
    setReason(next);
    setFieldErrors({});
    setError('');
    setTransferRef('');
    setTransferDone(false);
    if (next === 'parrainage') {
      // Mobile Money n'est pas proposé pour un parrainage.
      if (method === 'momo') setMethod('card');
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

  function chooseMethod(next: Method) {
    setMethod(next);
    setHelloPaid(null);
    setTransferRef('');
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

  /** Virement : le serveur enregistre la promesse et renvoie la référence à recopier. */
  async function requestTransferReference() {
    setPending(true);
    setError('');
    const payload = isSponsor
      ? {
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
        }
      : {
          amount,
          currency: cur,
          frequency: monthly ? 'monthly' : 'once',
          projectSlug: projectSlug || undefined,
          donorEmail: emailOk ? donorEmail.trim() : undefined,
          donorFirstName: firstName.trim() || undefined,
          donorLastName: lastName.trim() || undefined,
          donorCountry: country || undefined
        };
    try {
      const response = await fetch(isSponsor ? '/api/parrainer/virement' : '/api/dons/virement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 201 && typeof data.reference === 'string') {
        setTransferRef(data.reference);
        setTransferReused(data.reused === true);
        setNewsletterSent(await subscribeNewsletter());
        setTransferDone(true);
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    }
    setPending(false);
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
    if (method === 'virement') {
      await requestTransferReference();
      return;
    }
    // Carte en devise autre que l'euro, ou Mobile Money : le bouton propose
    // de passer au virement plutôt que de ne rien faire.
    chooseMethod('virement');
  }

  /** Fin du paiement signalée par HelloAsso : remerciement, inscription aux
   * nouvelles si demandée, et message à l'association avec la raison du don
   * (HelloAsso ne la connaît pas). Sans e-mail, pas de message : HelloAsso
   * garde de toute façon la trace du paiement. */
  async function onHelloPurchase(purchase: HelloAssoPurchase) {
    setHelloPaid(purchase);
    setNewsletterSent(await subscribeNewsletter());
    if (!emailOk) return;
    const reasonFr = T.fr.reasons[reason].t;
    const freqFr = purchase.frequency === 'monthly' ? 'mensuel' : purchase.frequency === 'one_time' ? 'ponctuel' : purchase.frequency || 'inconnue';
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`.trim() || donorEmail.trim(),
          email: donorEmail.trim(),
          phone: sponsorPhone.trim(),
          subject: `Don HelloAsso — ${reasonFr}`,
          message: [
            `Don réglé sur le formulaire HelloAsso intégré à /dons.`,
            `Raison : ${reasonFr}${isSponsor && !isCustom ? ` (${T.fr.planNames[amt]})` : ''}`,
            `Montant payé : ${purchase.value} € (${freqFr})`,
            `Commande HelloAsso n° ${purchase.transactionId || 'inconnu'}`,
            isSponsor ? 'Parrainage : à inscrire dans /gestion/parrains et à contacter.' : ''
          ]
            .filter(Boolean)
            .join('\n'),
          origin: 'helloasso'
        })
      });
    } catch {
      // Le paiement est fait : un message perdu ne doit pas inquiéter le donateur.
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
                      onClick={() => {
                        setCur(c);
                        setTransferRef('');
                        if (c !== 'EUR' && method === 'card') setMethod('virement');
                      }}
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
                {(Object.keys(t.methods) as Method[])
                  .filter((k) => !(isSponsor && k === 'momo'))
                  .map((k) => {
                  const m = t.methods[k];
                  const recommended = k === 'card' && cur === 'EUR';
                  const tag = m.tag;
                  // Carte et prélèvement (HelloAsso) : euros seulement.
                  const unavailable = k === 'card' && cur !== 'EUR';
                  const Icon = k === 'card' ? CreditCardIcon : k === 'momo' ? DeviceMobileIcon : BankIcon;
                  return (
                    <label
                      key={k}
                      className={`flex min-h-12 items-center gap-3 rounded-xl border-2 px-4 py-3 ${
                        unavailable ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'
                      } ${method === k ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'}`}
                    >
                      <input
                        type="radio"
                        name={`${id}-method`}
                        checked={method === k}
                        disabled={unavailable}
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

              {cur !== 'EUR' && <p className="m-0 -mt-3 text-[13px] text-ink-soft">{t.euroOnly}</p>}
              {showHello && helloSrc && (
                <div className="flex flex-col gap-4">
                  {helloPaid ? (
                    <p role="status" className="m-0 flex items-start gap-2 rounded-xl bg-sand p-5 text-[15px] font-bold leading-relaxed text-ink">
                      <CheckIcon size={20} className="mt-0.5 flex-none text-sage-700" aria-hidden />
                      <span>
                        {isSponsor ? t.helloSponsorThanks : t.helloThanks}
                        {newsletterSent && <span className="mt-1 block font-normal text-ink-soft">{t.newsletterSent}</span>}
                      </span>
                    </p>
                  ) : (
                    <p className="m-0 text-[14px] leading-[1.6] text-ink-body">{t.helloIntro(amountStr, monthly)}</p>
                  )}
                  <HelloAssoWidget
                    src={helloSrc}
                    title={t.helloTitle}
                    prefill={{
                      amount,
                      firstName,
                      lastName,
                      email: emailOk ? donorEmail.trim() : undefined,
                      country: ISO3[country]
                    }}
                    onPurchase={onHelloPurchase}
                  />
                </div>
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
                  {!transferRef && <p className="m-0 text-[13px] text-ink-soft">{t.virementNote}</p>}
                  {transferDone && transferRef && (
                    <div role="status" className="flex flex-col gap-2.5 rounded-lg bg-white p-4 text-[14px] leading-[1.5] text-ink">
                      <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">{t.referenceTitle}</span>
                      <span className="w-fit rounded-md bg-copper-tint px-3 py-1.5 font-mono text-[22px] font-extrabold tracking-[0.06em] text-copper-700">
                        {transferRef}
                      </span>
                      <span>{monthly ? t.referenceMonthly(`${amountStr}`) : t.referenceOnce(`${amountStr}`)}</span>
                      <span className="text-ink-soft">{t.referenceWhy}</span>
                      {transferReused && <span className="font-bold text-copper-700">{t.referenceReused}</span>}
                      <span className="flex items-start gap-2 font-bold">
                        <CheckIcon size={18} className="mt-0.5 flex-none text-sage-700" aria-hidden />
                        {isSponsor ? t.referenceSponsor : t.thanksTransfer}
                      </span>
                      {newsletterSent && <span className="text-ink-soft">{t.newsletterSent}</span>}
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
              onClick={() => {
                // Revenir en arrière annule la référence affichée : une
                // modification du don en demandera une nouvelle.
                setTransferRef('');
                setTransferDone(false);
                setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
              }}
              aria-label={t.back}
              className={`min-h-12 cursor-pointer rounded-full border-2 border-card-line bg-transparent px-5 text-[15px] font-bold text-ink ${
                step === 1 ? 'opacity-35' : 'opacity-100'
              }`}
            >
              {t.back}
            </button>
            {!(step === 3 && ((method === 'virement' && transferDone) || showHello)) && (
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
                ) : method === 'virement' ? (
                  <>
                    <CheckIcon aria-hidden />
                    {pending ? '…' : t.getReference}
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
              {method === 'card' && !onlineBlocked ? t.helloTrust : t.transferTrust}
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
