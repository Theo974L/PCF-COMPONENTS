import { Prestation } from "../domain/Prestation";

export interface ITableauProps {

    /**
     * Données brutes sérialisées (source PCF).
     */
    jalonsLivrables?: string;
    dataJson: string;
    favoritesDataJson?: string;

    refreshKey?: string;
    /**
     * JSON des favoris persistés.
     */
    nbItems?: number;
    selectedLibPrestation?: string;
    selectedIdPrestation?: string;
    /**
     * Sélection d’un élément dans le tableau.
     * Utilisé pour les outputs PCF (pattern onSelect).
     */
    onSelectGuid: (guid: string) => void;

    /**
     * Intention utilisateur : sélectionner un projet.
     * Sera traduite en event PCF par le wrapper.
     */

    onProjectFavorisToggle?: (payload: {
        guid: string;
        idPrestation: string;
        libPrestation: string;

    }) => void;

    onProjectSelect?: (payload: {
        guid: string;
        idPrestation: string;
        libPrestation: string;
    }) => void;

    /**
     * Mise à jour des favoris.
     */
    onFavoritesChange?: (favorites: string[]) => void;

    /**
     * Actions génériques (refresh, navigate, tooltip…).
     */
    onAction?: (action: {
        type: string;
        guid?: string;
        favorite?: boolean;
        data?: unknown;
    }) => void;
}


// // src/interfaces/ui/ITableauProps.ts
// export interface ITableauProps {
//     dataJson: string;
//     favoritesDataJson?: string;
//     JalonsLivrables?: string;
//     nbItems?: number;

//     onSelectGuid: (guid: string) => void;
//     onProjectSelect?: (projectGuid: string) => void;
//     onFavoritesChange?: (favorites: string[]) => void;

//     onAction?: (action: {
//         type: string;
//         guid?: string;
//         favorite?: boolean;
//         data?: unknown;
//     }) => void;
// }
