# TP1 — Tickets de maintenance (Vue.js 3 + JSON Server)

**Identité :** NOM Prénom — Groupe : …

## Prérequis
- Node.js (≥ 18) et npm
- Git

## Installation
```bash
npm install
```

## Lancement (deux terminaux, à garder actifs)
```bash
# Terminal 1 : API simulée sur http://localhost:3000/tickets
npx json-server db.json --port 3000

# Terminal 2 : application Vue
npm run dev
```
Ouvrir ensuite l'adresse affichée par Vite (en général http://localhost:5173).

## Fonctionnalités réalisées
- API REST simulée avec JSON Server à partir de `db.json` (3 tickets).
- `src/services/ticketService.js` : instance Axios avec `baseURL` et méthode `getTickets()`.
- `TicketList.vue` : affichage titre, demandeur, priorité, statut, date.
- Chargement avec `ref()`, `onMounted()` et `async/await`.
- Message « Chargement… » pendant la requête, message d'erreur explicite (avec bouton « Réessayer ») si le serveur est arrêté.
- Recherche par titre + filtres statut et priorité (`computed()`), cumulables.
- Compteur de tickets visibles et message lorsque la liste filtrée est vide.
- Badges de priorité et de statut accessibles (couleur + symbole + texte, contrastes suffisants, focus visible, libellés de formulaire).

## Captures
Voir le dossier `captures/` (01 à 05).

## Réponses aux questions

**Quelle différence entre une API REST et le fichier `db.json` ?**
`db.json` est seulement un fichier de données (le stockage). L'API REST est le service qui expose ces données via des URL HTTP (`GET /tickets`, `POST /tickets`, etc.) avec des codes de réponse. Ici JSON Server lit `db.json` et fournit l'API ; le client Vue ne lit jamais le fichier directement.

**Pourquoi utiliser `onMounted()` ?**
Ce hook s'exécute une fois que le composant est monté dans la page. On y lance la requête initiale pour charger les tickets au bon moment du cycle de vie, sans bloquer l'affichage, et pas à chaque rendu.

**Quel est le rôle d'Axios ?**
Axios est un client HTTP : il envoie les requêtes vers l'API, convertit automatiquement la réponse JSON en objets JavaScript, permet de définir une URL de base et un timeout, et lève une erreur pour les codes d'échec ou si le serveur est injoignable, ce qui simplifie la gestion des erreurs.

**Quelle différence entre `ref()` et `computed()` ?**
`ref()` stocke une valeur réactive que l'on modifie directement (tickets, recherche, filtres). `computed()` est une valeur dérivée, calculée à partir d'autres données réactives (liste filtrée, compteur) ; elle est mise en cache et recalculée uniquement quand ses dépendances changent, et elle n'est pas modifiée à la main.

## Difficultés rencontrées
- … (à compléter avec vos propres difficultés : port déjà utilisé, CORS, serveur arrêté, etc.)
