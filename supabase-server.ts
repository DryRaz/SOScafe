import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Client SERVICE ROLE — contourne totalement les Row Level Security.
// Ce fichier ne doit JAMAIS être importé depuis un composant "use client".
// Le paquet `server-only` fait planter le build si c'est le cas par erreur.
//
// Décision d'architecture (voir README du dépôt sos-caffe-db) : le client
// mobile ne parle jamais directement à Supabase. Toutes les lectures/écritures
// passent par ce client, utilisé uniquement dans des Server Components et des
// routes API (app/api/**), jamais exposé au navigateur.

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis (voir .env.example).'
  );
}

export const supabaseServer = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
