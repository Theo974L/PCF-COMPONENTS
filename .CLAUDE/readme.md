# Objectif 

Le but est de créer le meme composant que "Telechargement.png" mais avec PCF.

Je voudrais que tu respecte la capture d'écran, 
 - pour les champs "Nom du resp" enfaite j'ai une dropdown qui me propose des gens, et au click de l'icone avec la personne et un +, cela change le champs dropdown en un input libre pour les externe, 

 -Pour le champs statut, nous affichons un toggle avec "A faire" ou "Réalisé" pour les jalons
 et pour les livrables on a en attente, réalisé, en cours, ces champs sont modifiables

 -pour la bulle de commentaire, au click ca ouvre une pop up qui affiche le contenue qui peux etre editable


# Contrainte du composant / fonctionnalité cachée 

## ici je vais te dire comment le composant devrait fonctionner dans l'environnement powerapps, le but est de refaire ce composant en PCF:

- Le composant met à jour les données pour chaque changement que les lignes subissent (OnChange, OnMouseOut, OnClick ...)
- Pour les valeur de la colonne, Jalons & livrables, il faut desactivé l'edition du champs si la valeur commence par : "Demande d'équipier "
- Pour les checkboxs "Livrable", si elle est activé, alors dans la colonne Statut et on voit la combobox (En Attente, En Cours, Réalisé), si elle est desactivé, alors on voit "A faire" ou "Realisé"
- Les combobox de la colonne "Nom du resp", doivent bénéficier de l'entrée de source de données "PersonneDataJSON" 
- Pour l'icon commentaire, je veux que tu me fasse un popup moderne avec le choix d'enregistrer ou d'annuler, avec un fond flouter 
- Pour la poubelle je souhaite avoir une popup de confirmation que tu fasse un event, pour que je puisse supprimer la ligne dans powerapps

## Les entrée / Sortie / Event

Je veux que tu penses à tout, que ce soit :
- Les Event pour les CTA
- Les Entrée pour alimentée en données le tableau
- Les Sortie pour pouvoir controler les Events et Patch les données

Par exemple :
SelectedRowGUID en sorti
OnClickTrash en event
JalonDataJSON en entrée

lorsque je click sur un bouton, il declenche OnClickTrash en mettant a jour avant SelectedRowGUID
puis dans powerapps je la supprime avec une condition Filter([MaTable], [MaTableGUID] = [MonPCF.SelectedRowGUID])

## Tout le travail fourni jusqu'a ici à été réalisé par Copilot AI et moi, n'hesite pas a nous corriger