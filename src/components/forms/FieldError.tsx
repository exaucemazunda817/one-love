// Message d'erreur sous un champ. Relié au champ par aria-describedby (voir
// `errorProps`) et annoncé par les lecteurs d'écran quand le focus y arrive.
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="text-[14px] font-bold text-error">
      {message}
    </span>
  );
}

/** Attributs d'accessibilité d'un champ selon qu'il est en erreur ou non. */
export function errorProps(id: string, message?: string) {
  return message
    ? ({ 'aria-invalid': true, 'aria-describedby': id } as const)
    : ({} as Record<string, never>);
}
