# FitTrack — App Fitness

## Installation

```bash
# 1. Installe les dépendances
npm install

# 2. Lance l'app en développement
npm start
```

L'app s'ouvre automatiquement sur http://localhost:3000

## Structure du projet

```
src/
├── App.js                  # Point d'entrée, routing entre pages
├── index.css               # Variables CSS globales (couleurs, fonts)
│
├── hooks/
│   └── useLocalStorage.js  # Hook pour persister les données
│
├── components/
│   ├── Sidebar.js/.css     # Navigation latérale
│   └── ProgressBar.js      # Barre de progression réutilisable
│
└── pages/
    ├── Dashboard.js/.css   # Vue résumé
    ├── Training.js/.css    # Gestion des séances & exercices
    └── Nutrition.js/.css   # Suivi calories & macros
```

## Fonctionnalités

- **Dashboard** : résumé des stats du jour
- **Entraînement** : créer des séances, ajouter des exercices et des séries (reps + poids)
- **Nutrition** : suivre calories et macros par jour, historique des repas

## Ajouter de nouvelles fonctionnalités

Pour ajouter une nouvelle page :
1. Crée `src/pages/MaPage.js` et `MaPage.css`
2. Ajoute l'entrée dans `NAV` dans `Sidebar.js`
3. Importe et intègre dans `App.js`
