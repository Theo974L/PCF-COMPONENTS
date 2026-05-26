# PCF-COMPONENTS

Voici le dépôt contenant des composants PCF (PowerApps Component Framework) utilisés dans Power Apps.

## Présentation

Ce projet contient notamment le composant `Tableau`, un composant PCF qui affiche et gère un tableau de données dans une application Model-driven ou Canvas.

## Prérequis

- Node.js (>=14 recommandé)
- npm ou yarn
- (Optionnel) Power Platform CLI (`pac`) si vous utilisez les commandes de packaging/déploiement

## Installation

1. Installer les dépendances :

```
npm install
```

2. (Optionnel) Installer Power Platform CLI :

```
pac install latest
```

## Démarrage (startup du composant)

Pour lancer le développement local et observer le composant :

- Si le projet fournit un script de développement :

```
npm run start
```

- Sinon, compiler en mode watch :

```
npm run build -- --watch
```

- Pour tester dans Power Apps avec le CLI Power Platform :

```
pac pcf push --publisher-prefix <prefix>
```

Remplacez `<prefix>` par le préfixe de votre éditeur/publisher. Ces commandes peuvent varier selon la configuration du projet (vérifier les scripts du `package.json`).

## Fonctionnement du composant

- Initialisation :
	- Le point d'entrée est `index.ts` qui instancie le contrôle PCF et lie le `ControlManifest.Input.xml`.
	- Les propriétés configurées dans `ControlManifest.Input.xml` (propriétés de dataset, propriétés de champ) sont exposées au composant.

- Rendu :
	- Le composant principal est `Tableau.tsx` et utilise `interfaces.ts` pour typer les données entrantes.
	- Le style est géré par `styles.css` et le `tailwind.config.js` si Tailwind est utilisé.

- Événements et interaction :
	- Les événements (sélection, tri, édition) sont définis dans les interfaces situées sous `interface/` (ex. `ITableauEvents.ts`).
	- Le composant déclenche les callbacks fournis par la plateforme pour notifier les changements de données.

- Persistances / actions :
	- Les actions applicatives (CRUD, filtrage) sont gérées côté composant, puis remontées à la plateforme via les APIs PCF ou services côté serveur selon l'implémentation.

## Structure du projet (fichiers clés)

- `ControlManifest.Input.xml` : définition des propriétés et paramètres du composant.
- `index.ts` : point d'entrée du composant PCF.
- `Tableau.tsx` : composant React/TS principal affichant le tableau.
- `interfaces.ts` et `interface/` : types et contrats d'événements.
- `styles.css` / `tailwind.config.js` : styles et configuration CSS.
- `PCF_Composant.pcfproj` : projet MSBuild/packaging PCF.

## Build & packaging

Générer le bundle de production :

```
npm run build
```

Pour packager/déployer (ex. avec `pac`):

```
pac pcf push --publisher-prefix <prefix>
```
ou

```
msbuild PCF_Composant.pcfproj /t:Build
```

## Développement

- Lancer le watch pour itérations rapides : `npm run build -- --watch`.
- Linter : `npm run lint` (si disponible).

## Contribution

Merci de créer une issue ou une PR pour toute amélioration. Respectez les règles de commit et les conventions TypeScript/ESLint du projet.

## Contact / Aide

Pour toute question, ajoutez une issue sur ce dépôt ou contactez l'auteur du projet.


