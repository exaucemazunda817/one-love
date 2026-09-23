import { put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

// Stockage des pièces justificatives (comptabilité, dossiers RH, biens…).
// Toujours en accès PRIVÉ sur Vercel Blob, jamais dans public/ — même
// principe que les photos de membres sur gospel-nation. Sans jeton
// configuré, repli sur le disque local sous storage/documents, exclu du
// suivi Git (voir .gitignore : /storage entier).

const LOCAL_ROOT = path.join(process.cwd(), 'storage');
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo : un bordereau scanné dépasse vite le poids d'une photo.

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export interface StoredDocument {
  blobKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export async function storeDocument(file: File): Promise<StoredDocument> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non autorisé (PDF, JPEG, PNG ou WebP uniquement).');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Fichier trop volumineux (10 Mo maximum).');
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const key = `documents/${crypto.randomUUID()}.${extension}`;

  if (isBlobConfigured()) {
    // `blob.url` (accès privé) est stocké tel quel dans blobKey : c'est cette
    // URL, relue avec le jeton en Authorization, qui permet de retélécharger
    // le fichier — jamais accessible publiquement sans lui.
    const blob = await put(key, bytes, { access: 'private', contentType: file.type, addRandomSuffix: false });
    return { blobKey: blob.url, fileName: file.name, mimeType: file.type, sizeBytes: file.size };
  }

  const localPath = path.join(LOCAL_ROOT, key);
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, bytes);
  return { blobKey: key, fileName: file.name, mimeType: file.type, sizeBytes: file.size };
}

/** Relit un document stocké. Ne renvoie jamais l'URL brute : le contenu est
 * relu côté serveur puis reservi par une route authentifiée qui journalise
 * l'accès (voir /api/gestion/comptabilite/ecritures/[id]/documents/[docId]). */
export async function readDocument(blobKey: string): Promise<Buffer | null> {
  if (blobKey.startsWith('http')) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const response = await fetch(blobKey, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  }

  try {
    return await fs.readFile(path.join(LOCAL_ROOT, blobKey));
  } catch {
    return null;
  }
}
