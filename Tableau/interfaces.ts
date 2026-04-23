export interface Prestation {
    Etat_Meteo: string;
    Guid: string;
    JalonsLivrables: string;
    Name: string;
    idPrestation: string;
    libClient: string;
    libEtat: string;
    libPrestation: string;
    libRespFiches: string;
    libRespPrestation: string;
    libSousDomaine: string;
    refPrestation: string;
}




export interface ITableauProps {
    dataJson: string;
    nbItems?: number;
    JalonsLivrables?: string;
    onSelectGuid: (guid: string) => void;
    onProjectSelect?: (payload: {
            guid: string;
            idPrestation: string;
            libPrestation: string;
    }) => void;
    onProjectFavorisToggle?: (payload: {
        guid: string;        
        idPrestation: string;
        libPrestation: string;
    }) => void;
    onFavoritesChange?: (favorites: string[]) => void;
    favoritesDataJson?: string;
    onAction?: (action: { type: string; guid?: string; favorite?: boolean; data?: unknown }) => void;
}