/**
 * Events exposés par le PCF vers Power Apps (Power Fx).
 * Ces méthodes correspondent aux <event> du manifest.
 */
export interface ITableauEvents {

    /**
     * Déclenché lorsque l’utilisateur sélectionne un projet.
     * @param projectGuid Guid du projet sélectionné
     */
    OnProjectSelect: (projectGuid: string) => void;
}
