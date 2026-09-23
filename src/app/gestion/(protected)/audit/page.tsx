import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatFieldDateTime } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'Journal d’audit — Gestion',
  robots: { index: false, follow: false }
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  VALIDATE: 'Validation',
  LOCK: 'Verrouillage',
  EXPORT: 'Export',
  LOGIN: 'Connexion',
  LOGIN_FAILED: 'Connexion refusée',
  VIEW_SENSITIVE: 'Consultation sensible'
};

export default async function AuditPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (user.role !== 'DIRECTION') redirect('/gestion');

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Journal d&apos;audit</h1>
        <p className="mt-1 text-sm text-ol-muted">Les 100 dernières actions enregistrées.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Auteur</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Entité</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-ol-line last:border-0">
                <td className="px-5 py-3 whitespace-nowrap text-ol-muted">
                  {formatFieldDateTime(log.createdAt)}
                </td>
                <td className="px-5 py-3 text-ol-ink">{log.actorEmail}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-bold ${
                      log.action === 'LOGIN_FAILED' ? 'text-ol-ember-ink' : 'text-ol-ink'
                    }`}
                  >
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-ol-muted">
                  {log.entity} · {log.entityId}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ol-muted">
                  Aucune action enregistrée pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
