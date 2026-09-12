# SOS Caffè — App client (Phase 3)

App mobile-first pour scanner-commander-payer, branchée sur le projet Supabase `sos-caffe`. **Le paiement est factice à ce stade** (voir plus bas) — cette version sert à valider l'UX de commande avant de brancher M-Pesa en Phase 4.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Le fichier `.env.local` est déjà prérempli avec l'URL de ton projet Supabase (`sos-caffe`) — il te manque juste la clé `service_role` :

1. Supabase Dashboard → projet `sos-caffe` → **Settings → API**
2. Copie la clé **service_role** (secrète, différente de l'anon key)
3. Colle-la dans `.env.local` à la place de `colle-ta-clé-service_role-ici`

Je n'ai pas cette clé moi-même — elle n'est volontairement pas accessible via mes outils (privilèges élevés, jamais exposée à un assistant).

## Ce qui est fonctionnel

- Menu complet chargé depuis Supabase (catégories, produits, tailles single/double, extras)
- Panier (persisté sur l'appareil du client, survit à un rechargement de page)
- Checkout avec téléphone + prénom optionnel
- Écran de confirmation avec numéro de commande (`#12`, etc.) à montrer au comptoir
- Toute écriture transite par `app/api/orders/route.ts` côté serveur — **le prix final est toujours recalculé depuis la base**, jamais accepté tel quel depuis le navigateur

## ⚠️ Paiement factice — à corriger avant la mise en prod

Dans `app/api/orders/route.ts`, la commande est créée directement avec `status: 'paid'`, sans aucun paiement réel. C'est marqué `TEMPORAIRE (Phase 3)` dans le code. La Phase 4 remplacera ça par :
1. `status: 'awaiting_payment'` à la création
2. Déclenchement du STK Push M-Pesa
3. Passage à `'paid'` uniquement via le webhook Safaricom confirmé

## Langue de l'interface

L'app est en anglais, comme ta carte imprimée — cohérent avec ta clientèle mixte (missionnaires, étudiants, voyageurs).

## Déploiement (Vercel)

1. Pousse ce dossier sur un repo GitHub (le `.gitignore` exclut déjà `.env.local`, donc ta clé service_role ne partira jamais dans le repo)
2. Importe le repo sur [vercel.com](https://vercel.com)
3. Dans les Environment Variables du projet Vercel, ajoute `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (les mêmes valeurs que ton `.env.local`)
4. Deploy

## Limite connue à garder en tête

`order_item_modifiers` ne stocke pas de prix figé au moment de la commande — si tu changes le prix d'un extra plus tard, l'historique des anciennes commandes affichera rétroactivement le nouveau prix à l'affichage. Acceptable pour ce stade, à corriger si le reporting financier devient important (Phase 6).
