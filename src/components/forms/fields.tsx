// Composants de champ partagés par tous les formulaires publics : même style,
// même comportement d'erreur, une seule fois.

export function Field({
  label,
  htmlFor,
  error,
  children,
  optional
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
        {label}
        {optional && <span className="ml-1 font-normal text-ol-muted">(facultatif)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink placeholder:text-ol-muted focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-32 resize-y`} />;
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Envoi en cours…' : children}
    </button>
  );
}
