# Backpack-2

> Une architecture Backend Node.js scalable, prête à l'emploi, open source.

**Backpack** est une collection d'architectures prêtes à l'emploi. Pas juste un template — une vraie structure pensée, documentée, avec une logique claire derrière chaque choix.

| Épisode | Focus | Stack |
|---------|-------|-------|
| **Backpack-0** | Frontend Next.js 15 | App Router · TypeScript · Tailwind CSS |
| **Backpack-1** | Back-Office React (FSD) | Vite · React 19 · Feature-Sliced Design |
| **Backpack-2** | API REST modulaire | Express 5 · MongoDB · ES Modules |

Tu clones, tu comprends, tu construis.

---

## Le problème

Le vrai coût d'un backend, ça ne se voit pas à la livraison. Ça se voit 6 mois après.

- Ajouter un endpoint prend 3x plus de temps.
- Les devs ont peur de toucher au code existant.
- Les routes deviennent un fichier de 800 lignes.
- Chaque nouvelle ressource = copier-coller de la même logique CRUD.

Ce n'est pas un problème de développeur. C'est un problème d'architecture — et donc un problème business.

---

## Ce que c'est

Une architecture **modulaire par domaine** avec un **routage filesystem** — la structure des dossiers reflète directement les URLs de l'API.

**4 couches. Des règles strictes. Zéro ambiguïté.**

```
routes → modules → _shared → databases
```

| Couche | Rôle |
|--------|------|
| `routes/` | Points d'entrée HTTP — un dossier = un segment d'URL |
| `modules/` | Logique métier par domaine (model + services) |
| `modules/_shared/` | Abstractions réutilisables (base CRUD) |
| `databases/` | Connexion et configuration des bases de données |

---

## Structure du projet

```
src/
├── main.js                          # Point d'entrée — Express, middlewares, démarrage
├── databases/
│   └── connect-mongo.js             # Connexion MongoDB
├── routes/
│   ├── index.js                     # Routeur racine
│   └── users/
│       ├── index.js                 # Validation + montage des sous-routes
│       ├── routes.js                # GET /users · POST /users
│       └── [userId]/
│           ├── index.js             # Montage /products
│           ├── routes.js            # GET · PUT · DELETE /users/:userId
│           └── products/
│               ├── index.js         # Validation productId
│               ├── routes.js        # GET · POST /users/:userId/products
│               └── [productId]/
│                   ├── index.js
│                   └── routes.js    # GET · PUT · DELETE /users/:userId/products/:productId
└── modules/
    ├── _shared/
    │   └── base-services.js         # Factory CRUD réutilisable
    ├── user/
    │   ├── index.js
    │   ├── model/index.js           # Schéma Mongoose
    │   └── services/index.js        # Services métier
    └── product/
        ├── index.js
        ├── model/index.js
        └── services/index.js
```

### Routage filesystem

Le dossier `routes/` reproduit l'arborescence des URLs :

```
/users                              → routes/users/routes.js
/users/:userId                      → routes/users/[userId]/routes.js
/users/:userId/products             → routes/users/[userId]/products/routes.js
/users/:userId/products/:productId  → routes/users/[userId]/products/[productId]/routes.js
```

Chaque niveau a son `index.js` qui monte les sous-routes et applique la validation (ex. `ObjectId`).

### Modules par domaine

Chaque module encapsule son modèle et ses services :

```
modules/user/
├── model/index.js      # Schéma + modèle Mongoose
└── services/index.js   # Hérite des opérations CRUD via base-services
```

Les routes importent uniquement les **services** — jamais les modèles directement.

### Base services

`modules/_shared/base-services.js` expose une factory qui génère les opérations CRUD standard :

- `fetchAll` — liste paginée
- `fetchById` — récupération par ID
- `createOne` — création
- `updateById` — mise à jour
- `deleteById` — suppression

Chaque module étend cette base sans dupliquer de code :

```js
import baseServicesFactory from "#@/modules/_shared/base-services.js";

export default {
  ...baseServicesFactory(model),
};
```

---

## La stack

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | ES Modules | Runtime |
| Express | 5 | Framework HTTP |
| Mongoose | 8 | ODM MongoDB |
| dotenv | — | Variables d'environnement |
| cors | — | Cross-Origin Resource Sharing |
| nodemon | — | Hot reload (dev) |

---

## Démarrage rapide

### Prérequis

- Node.js 18+
- MongoDB en cours d'exécution

### Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd backpack-2

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
```

### Variables d'environnement

```env
MONGO_DB_URI=mongodb://localhost:27017/restaurants_db
PORT=4000
```

### Lancer le serveur

```bash
# Développement (hot reload)
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:4000`.

---

## API

### Users

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/users` | Liste paginée des utilisateurs |
| `POST` | `/users` | Créer un utilisateur |
| `GET` | `/users/:userId` | Récupérer un utilisateur |
| `PUT` | `/users/:userId` | Mettre à jour un utilisateur |
| `DELETE` | `/users/:userId` | Supprimer un utilisateur |

### Products (imbriqués sous user)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/users/:userId/products` | Liste paginée des produits |
| `POST` | `/users/:userId/products` | Créer un produit |
| `GET` | `/users/:userId/products/:productId` | Récupérer un produit |
| `PUT` | `/users/:userId/products/:productId` | Mettre à jour un produit |
| `DELETE` | `/users/:userId/products/:productId` | Supprimer un produit |

### Format de réponse

```json
{
  "success": true,
  "data": { ... }
}
```

### Pagination

```
GET /users?page=1&limit=10
```

```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "total": 42,
      "totalPages": 5,
      "page": 1,
      "limit": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

Des fichiers `.rest` sont disponibles dans `test/` pour tester l'API avec l'extension REST Client de VS Code.

---

## Alias d'import

Le projet utilise des imports absolus via l'alias `#@/` :

```js
import connectMongoDB from "#@/databases/connect-mongo.js";
import userServices from "#@/modules/user/services/index.js";
```

Configuré dans `package.json` (imports) et `jsconfig.json` (autocomplétion IDE).

---

## Règles d'architecture

1. **Les routes ne contiennent pas de logique métier** — elles délèguent aux services.
2. **Les services ne connaissent pas Express** — ils reçoivent des objets, pas `req`/`res`.
3. **Un module = un domaine** — `user`, `product`, etc. Chaque module a son `model/` et `services/`.
4. **Le partagé vit dans `_shared/`** — jamais importé depuis un module spécifique vers un autre.
5. **La structure des routes reflète les URLs** — pas de table de routage centralisée opaque.
6. **Validation au bon niveau** — `ObjectId`, auth, etc. dans les `index.js` de chaque segment.

---

## Ajouter une nouvelle ressource

Exemple : ajouter `orders` sous un utilisateur.

```
1. Créer le module
   modules/order/
   ├── index.js
   ├── model/index.js
   └── services/index.js

2. Créer les routes
   routes/users/[userId]/orders/
   ├── index.js
   ├── routes.js
   └── [orderId]/
       ├── index.js
       └── routes.js

3. Monter dans routes/users/[userId]/index.js
   router.use("/orders", ordersRoutes);
```

C'est tout. La structure guide l'implémentation.

---

## La série Backpack

| # | Architecture | Repo |
|---|-------------|------|
| 0 | Frontend Next.js 15 scalable | [Backpack-0](https://lnkd.in/djgUjaEc) |
| 1 | Back-Office React FSD | [Backpack-1](https://lnkd.in/dpEEqY5x) |
| 2 | API REST Node.js modulaire | Ce repo |

Chaque épisode couvre un nouveau besoin. Clone, comprends, construis.

---

## Licence

ISC
