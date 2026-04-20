# Composant PCF Tableau de Prestations

## Nom du composant
Tableau

## Objectif
Afficher un tableau de prestations avec des informations structurées, des icônes d'état et des filtres interactifs.

## Description fonctionnelle
Le composant affiche un tableau basé sur un JSON fourni en entrée. Chaque ligne représente une prestation avec des colonnes pour l'état, le domaine, la prestation, etc. Des filtres permettent de filtrer par état, domaine et client. Un bouton "Voir" permet de sélectionner une prestation.

## Cas d’usage
- Affichage de listes de prestations dans une application Power Apps Canvas.
- Permettre aux utilisateurs de filtrer et visualiser les détails des prestations.

## Paramètres Power Apps

### dataJson
- **Nom technique** : dataJson
- **Libellé recommandé** : Données JSON
- **Type** : Multiple (texte)
- **Obligatoire** : Oui
- **Valeur par défaut** : []
- **Description fonctionnelle** : Chaîne JSON contenant un tableau d'objets représentant les prestations.
- **Impact sur le comportement** : Sans cette donnée, le tableau sera vide.
- **Exemple concret d’utilisation** : `[{"Etat_Meteo":"1","Guid":"796a5932-0a3a-f111-88b5-002248da42e0","libEtat":"Terminé",...}]`

### selectedGuid (Output)
- **Nom technique** : selectedGuid
- **Libellé recommandé** : GUID sélectionné
- **Type** : SingleLine.Text
- **Obligatoire** : Non
- **Description fonctionnelle** : GUID de la prestation sélectionnée via le bouton Voir.
- **Impact sur le comportement** : Permet de réagir à la sélection dans Power Apps.

## Données d’entrée attendues
Format JSON : Tableau d'objets avec les champs suivants :
- Etat_Meteo (string)
- Guid (string)
- JalonsLivrables (string)
- Name (string)
- idPrestation (string)
- libClient (string)
- libEtat (string)
- libPrestation (string)
- libRespFiches (string)
- libRespPrestation (string)
- libSousDomaine (string)
- refPrestation (string)

## Limitations connues
- Le JSON doit être valide, sinon le tableau sera vide.
- Les icônes sont des emojis simples.
- Pas de tri automatique sur les colonnes.

## Bonnes pratiques d’utilisation
- Fournir un JSON bien formé.
- Utiliser les filtres pour améliorer l'expérience utilisateur.
- Gérer l'output selectedGuid pour naviguer ou afficher des détails.

## Points d’attention pour les makers
- Assurer que les données sont cohérentes.
- Tester avec des données réelles avant déploiement.

## Évolutions possibles du composant
- Ajouter un tri sur les colonnes.
- Personnaliser les icônes.
- Ajouter plus de filtres.