# Attendo

Application web pour gérer les sessions d'examens et noter la présence des étudiants. Elle suit le déroulement réel d'un examen : session → UE → examen → local → étudiants.

Projet réalisé dans le cadre de mes études à la HE2B-ESI, avec Vue 3 pour l'interface et Supabase pour les données.

## Ce que l'application permet de faire

- Se connecter avec un compte du personnel (les pages sont protégées : sans connexion, on est redirigé)
- Créer des sessions d'examens et y rattacher des UE
- Créer des examens pour une UE (examen, projet, évaluation...)
- Ajouter des locaux à un examen et voir leur capacité ainsi que le nombre d'étudiants présents
- Désigner le surveillant d'un local
- Marquer un étudiant présent ou absent en cliquant sur sa ligne (la couleur change et c'est enregistré directement dans la base)
- Se repérer grâce au fil d'Ariane affiché à chaque niveau

## Parcours dans l'application

Connexion → Sessions → UE → Examen → Local → Surveillant et présences

## Technologies utilisées

- **Interface** : Vue 3, Vue Router, Pinia
- **Outils** : Vite, ESLint
- **Style** : Tailwind CSS
- **Données et authentification** : Supabase
- **Environnement** : Node.js, npm

## Organisation du code

```
├── public/          # fichiers statiques
├── src/
│   ├── components/  # composants réutilisables (tableaux, formulaires, cartes...)
│   ├── router/      # routes et protection des pages
│   ├── services/    # accès aux données Supabase
│   ├── stores/      # stores Pinia
│   ├── views/       # pages de l'application
│   ├── App.vue
│   ├── main.js
│   └── supabase.js  # configuration du client Supabase
├── index.html
└── package.json
```

## Installation


```
npm install
npm run dev

```
Autres commandes utiles :

```
npm run build    # build de production
npm run preview  # aperçu du build
npm run lint     # vérification ESLint
```


## Auteur

Aninia Abla Negue projet réalisé dans le cadre du cours de WEB4