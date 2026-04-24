import * as React from 'react';
import { Prestation, ITableauProps } from './interfaces';

interface TableauState {
    data: Prestation[];
    filterEtat: string;
    filterDomaine: string;
    filterClient: string;
    filterName: string;
    sortColumn: keyof Prestation | null;
    sortDirection: 'asc' | 'desc';
    currentPage: number;
    pageSize: number;
    favorites: string[];
    tooltipGuid: string | null;
    tooltipData: JalonLivrableUi[] | null;
}



export interface JalonLivrableRaw {
    cr9e8_date_de_fin_actualisee: string | null;
    cr9e8_name: string;
    cre69_livrable: boolean | null;
    cre69_notes: string | null;
}


export interface JalonLivrableUi {
    label: string;
    date?: string;
    isLivrable: boolean;
    notes?: string;
}



function isPrestation(obj: unknown): obj is Prestation {
    if (!obj || typeof obj !== 'object') return false;
    const o = obj as Record<string, unknown>;
    return typeof o.Guid === 'string'
        && typeof o.libPrestation === 'string'
        && typeof o.libEtat === 'string'
        && typeof o.libSousDomaine === 'string'
        && typeof o.libClient === 'string';
}

const getMeteoIcon = (etat: string): JSX.Element => {
    switch (etat) {
        case '1':
            return (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" fill="#e2ff0a" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM4.39861 4.39861C4.6915 4.10572 5.16638 4.10572 5.45927 4.39861L5.85211 4.79145C6.145 5.08434 6.145 5.55921 5.85211 5.85211C5.55921 6.145 5.08434 6.145 4.79145 5.85211L4.39861 5.45927C4.10572 5.16638 4.10572 4.6915 4.39861 4.39861ZM19.6011 4.39887C19.894 4.69176 19.894 5.16664 19.6011 5.45953L19.2083 5.85237C18.9154 6.14526 18.4405 6.14526 18.1476 5.85237C17.8547 5.55947 17.8547 5.0846 18.1476 4.79171L18.5405 4.39887C18.8334 4.10598 19.3082 4.10598 19.6011 4.39887ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM18.1476 18.1476C18.4405 17.8547 18.9154 17.8547 19.2083 18.1476L19.6011 18.5405C19.894 18.8334 19.894 19.3082 19.6011 19.6011C19.3082 19.894 18.8334 19.894 18.5405 19.6011L18.1476 19.2083C17.8547 18.9154 17.8547 18.4405 18.1476 18.1476ZM5.85211 18.1479C6.145 18.4408 6.145 18.9157 5.85211 19.2086L5.45927 19.6014C5.16638 19.8943 4.6915 19.8943 4.39861 19.6014C4.10572 19.3085 4.10572 18.8336 4.39861 18.5407L4.79145 18.1479C5.08434 17.855 5.55921 17.855 5.85211 18.1479ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z" fill="#e2ff0a" />
                </svg>
            );
        case '2':
            return (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.381 11.0272C14.9767 10.8191 15.6178 10.7059 16.2857 10.7059C16.9404 10.7059 17.5693 10.8147 18.1551 11.015M7.11616 13.6089C6.8475 13.5567 6.56983 13.5294 6.28571 13.5294C3.91878 13.5294 2 15.4256 2 17.7647C2 20.1038 3.91878 22 6.28571 22H16.2857C19.4416 22 22 19.4717 22 16.3529C22 13.8811 20.393 11.7802 18.1551 11.015M7.11616 13.6089C6.88706 12.9978 6.7619 12.3369 6.7619 11.6471C6.7619 8.52827 9.32028 6 12.4762 6C15.4159 6 17.8371 8.19371 18.1551 11.015M7.11616 13.6089C7.68058 13.7184 8.20528 13.9374 8.66667 14.2426" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="1" d="M8 4.5C6.067 4.5 4.5 6.067 4.5 8C4.5 9.3962 5.31753 10.6015 6.5 11.1632M8 4.5C8.74362 4.5 9.43308 4.73191 10 5.12734M8 4.5C7.25638 4.5 6.56692 4.73191 6 5.12734M8 4.5C8.95365 4.5 9.81822 4.88141 10.4495 5.5M8 4.5C7.04635 4.5 6.18178 4.88141 5.55051 5.5M8 4.5C9.27316 4.5 10.3876 5.17979 11 6.19621" stroke="#e2ff0a" strokeWidth="1.5" />
                    <path opacity="0.5" d="M7.5 2V2.5" stroke="#e2ff0a" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M2.5 7.5L2 7.5" stroke="#e2ff0a" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M11.3887 3.61133L11.1726 3.82739" stroke="#e2ff0a" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M3.82715 11.1729L3.61109 11.3889" stroke="#e2ff0a" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M3.82715 3.82715L3.61109 3.61109" stroke="#e2ff0a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );
        case '3':
            return (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 13.3529C22 15.2939 21.0091 17.0061 19.5 18.0226M14.381 8.02721C14.9767 7.81911 15.6178 7.70588 16.2857 7.70588C16.9404 7.70588 17.5693 7.81468 18.1551 8.01498M7.11616 10.6089C6.8475 10.5567 6.56983 10.5294 6.28571 10.5294C3.91878 10.5294 2 12.4256 2 14.7647C2 16.0746 2.60178 17.2457 3.54704 18.0226M7.11616 10.6089C6.88706 9.9978 6.7619 9.33687 6.7619 8.64706C6.7619 5.52827 9.32028 3 12.4762 3C15.4159 3 17.8371 5.19371 18.1551 8.01498M7.11616 10.6089C7.68059 10.7184 8.20528 10.9374 8.66667 11.2426M18.1551 8.01498C18.8381 8.24853 19.4623 8.60648 20 9.06141" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M17 19L15 21" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 15.5L14 17.5" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 20L10 22" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11.5 15.5L9.5 17.5" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7.5 19L5.5 21" stroke="#b8b8b8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );
        default:
            return (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12.3529C22 15.0599 20.0726 17.3221 17.5 17.8722M6.28571 18C3.91878 18 2 16.1038 2 13.7647C2 11.4256 3.91878 9.52941 6.28571 9.52941C6.56983 9.52941 6.8475 9.55673 7.11616 9.60887M14.381 7.02721C14.9767 6.81911 15.6178 6.70588 16.2857 6.70588C16.9404 6.70588 17.5693 6.81468 18.1551 7.01498M7.11616 9.60887C6.88706 8.9978 6.7619 8.33687 6.7619 7.64706C6.7619 4.52827 9.32028 2 12.4762 2C15.4159 2 17.8371 4.19371 18.1551 7.01498M7.11616 9.60887C7.68059 9.71839 8.20528 9.9374 8.66667 10.2426M18.1551 7.01498C18.8381 7.24853 19.4623 7.60648 20 8.06141" stroke="#787878" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10 22.0002L14.2857 18.3078H10L14.2857 14.6152" stroke="#787878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
    }
};

const getEtatIcon = (etat: string): JSX.Element => {
    switch (etat) {
        case 'Terminé':
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#107C10" />
                    <path d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#ffffff" />
                </svg>
            );
        case 'En cours':
            return (
                <svg width="16" height="16" fill="#0011ff" viewBox="-1.44 -1.44 26.88 26.88" id="Outline" xmlns="http://www.w3.org/2000/svg" stroke="#0011ff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>194 restore</title> <path d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z M23.812,10.132A12,12,0,0,0,3.578,3.415V1a1,1,0,0,0-2,0V5a2,2,0,0,0,2,2h4a1,1,0,0,0,0-2H4.827a9.99,9.99,0,1,1-2.835,7.878A.982.982,0,0,0,1,12a1.007,1.007,0,0,0-1,1.1,12,12,0,1,0,23.808-2.969Z"></path></g></svg>
            );
        default:
            return (
                <svg width="16" height="16" viewBox="-1.92 -1.92 27.84 27.84" xmlns="http://www.w3.org/2000/svg" fill="#ff0000" stroke="#ff0000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-9h10v2H7v-2z"></path> </g> </g></svg>
            );
    }
};





export class TableauComponent extends React.Component<ITableauProps, TableauState> {

    
    private handleProjectClick = (guid: string, idPrestation: string, libPrestation: string) => {
        // ✅ React déclenche UNE intentions
        this.props.onProjectSelect?.({ guid, idPrestation, libPrestation });
    };

    
    private handleProjectFavorisClick = (
        guid: string,
        idPrestation: string,
        libPrestation: string
    ) => {
        this.props.onProjectFavorisToggle?.({
            guid,
            idPrestation,
            libPrestation
        });
    };


    constructor(props: ITableauProps) {
        super(props);
        this.state = {
            data: this.parseData(props.dataJson),
            filterEtat: '',
            filterDomaine: '',
            filterClient: '',
            filterName: '',
            sortColumn: null,
            sortDirection: 'asc',
            currentPage: 0,
            pageSize: props.nbItems ?? 5,
            favorites: props.favoritesDataJson ? this.parseFavoritesProp(props.favoritesDataJson) : [],
            tooltipGuid: null,
            tooltipData:
                this.parseJalonsLivrables(
                    props.jalonsLivrables
                )

        };
        
    }

    handleRefresh = () => {

        this.props.onAction?.({ type: 'refresh' }); 

    };

    handleNavigate = (guid: string) => {
        this.props.onSelectGuid(guid);
        if (this.props.onAction) this.props.onAction({ type: 'navigate', guid });
    };

    
    private parseJalonsLivrables(
        json?: string | null
    ): JalonLivrableUi[] | null {
        if (!json) return null;

        try {
            const raw = JSON.parse(json) as JalonLivrableRaw[];

            if (!Array.isArray(raw) || raw.length === 0) {
                return null;
            }

            return raw.map(j => ({
                label: j.cr9e8_name,
                date: j.cr9e8_date_de_fin_actualisee
                    ? new Date(j.cr9e8_date_de_fin_actualisee)
                        .toLocaleDateString("fr-FR")
                    : undefined,
                isLivrable: j.cre69_livrable === true,
                notes: j.cre69_notes ?? undefined
            }));
        } catch {
            return null;
        }
    }


    componentDidUpdate(prevProps: ITableauProps) {
        if (prevProps.dataJson !== this.props.dataJson) {
            this.setState({
                data: this.parseData(this.props.dataJson),
                currentPage: 0
            });
        }
        
        if (prevProps.jalonsLivrables !==this.props.jalonsLivrables) {
            this.setState({
                tooltipData: this.parseJalonsLivrables(
                    this.props.jalonsLivrables
                )
            });
        }

    }

    
    isFavorite(guid: string): boolean {
        return this.state.favorites.includes(guid);
    }


    parseData(dataJson: string): Prestation[] {
        try {
            const parsed: unknown = JSON.parse(dataJson);
            if (Array.isArray(parsed) && parsed.every(isPrestation)) {
                return parsed;
            }
        } catch {
            // ignore invalid JSON and return empty array
        }
        return [];
    }


    parseFavoritesProp(favJson?: string): string[] {
        if (!favJson) return [];
        try {
            const parsed: unknown = JSON.parse(favJson);
            if (Array.isArray(parsed)) {
                if (parsed.every((p): p is string => typeof p === 'string')) return parsed;

                const guids = parsed
                    .map(p => {
                        if (p && typeof p === 'object') {
                            const rec = p as Record<string, unknown>;
                            const g = rec.Guid;
                            return typeof g === 'string' ? g : undefined;
                        }
                        return undefined;
                    })
                    .filter((g): g is string => typeof g === 'string');

                if (guids.length > 0) return guids;
            }
            if (typeof parsed === 'string') return [parsed];
        } catch {
            // ignore
        }
        return [];
    }

    getFilteredData(): Prestation[] {
        let filtered = this.state.data.filter(item =>
            (!this.state.filterEtat || item.libEtat === this.state.filterEtat) &&
            (!this.state.filterDomaine || item.libSousDomaine === this.state.filterDomaine) &&
            (!this.state.filterClient || item.libClient === this.state.filterClient) &&
            (!this.state.filterName || item.libPrestation.toLowerCase().includes(this.state.filterName.toLowerCase()))
        );

        if (this.state.sortColumn) {
            filtered = [...filtered].sort((a, b) => {
                
                const key = this.state.sortColumn!;

                const aVal = String(a[key] ?? "");
                const bVal = String(b[key] ?? "");

                return this.state.sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        }

        return filtered;
    }

    handleSort(column: keyof Prestation) {
        this.setState(prevState => ({
            sortColumn: column,
            sortDirection: prevState.sortColumn === column && prevState.sortDirection === 'asc' ? 'desc' : 'asc',
            currentPage: 0
        }));
    }

    handlePageChange(direction: 'prev' | 'next') {
        this.setState(prevState => ({
            currentPage: direction === 'next' ? prevState.currentPage + 1 : Math.max(0, prevState.currentPage - 1)
        }));
    }

    getUniqueValues(field: keyof Prestation): string[] {
        return Array.from(new Set(this.state.data.map(item => item[field]))).filter(Boolean);
    }

    
    private hasJalonsLivrables(jalonsLivrablesJson?: string | null, jalonsLivrables?: string | null): boolean {
        if (!jalonsLivrablesJson) return false;
        
        if(jalonsLivrables == "1") {
            return true;
        }

            
        try {
            const parsed: unknown = JSON.parse(jalonsLivrablesJson);

            return Array.isArray(parsed) && parsed.length > 0;
        } catch {
            return false;
        }


    }

    private handleTooltipToggle = (
        guid: string,
        jalonsLivrablesJson?: string | null
    ): void => {
        // Si on clique sur le même élément → on ferme
        if (this.state.tooltipGuid === guid) {
            this.setState({
                tooltipGuid: null,
                tooltipData: null,
            });
            return;
        }

        // Sinon, on tente de parser les jalons/livrables
        if (!jalonsLivrablesJson) {
            this.setState({
                tooltipGuid: null,
                tooltipData: null,
            });
            return;
        }

        try {
            const raw = JSON.parse(jalonsLivrablesJson) as JalonLivrableRaw[];

            if (!Array.isArray(raw) || raw.length === 0) {
                this.setState({
                    tooltipGuid: null,
                    tooltipData: null,
                });
                return;
            }

            const tooltipData: JalonLivrableUi[] = raw.map(j => ({
                label: j.cr9e8_name,
                date: j.cr9e8_date_de_fin_actualisee
                    ? new Date(j.cr9e8_date_de_fin_actualisee).toLocaleDateString("fr-FR")
                    : undefined,
                isLivrable: j.cre69_livrable === true,
                notes: j.cre69_notes ?? undefined,
            }));

            this.setState({
                tooltipGuid: guid,
                tooltipData,
            });
        } catch {
            this.setState({
                tooltipGuid: null,
                tooltipData: null,
            });
        }
    };



    render() {
        const filteredData = this.getFilteredData();
        const totalPages = Math.max(1, Math.ceil(filteredData.length / this.state.pageSize));
        const paginatedData = filteredData.slice(
            this.state.currentPage * this.state.pageSize,
            (this.state.currentPage + 1) * this.state.pageSize
        );
        const etats = this.getUniqueValues('libEtat');
        const domaines = this.getUniqueValues('libSousDomaine');
        const clients = this.getUniqueValues('libClient');
        const getSortIndicator = (column: keyof Prestation): string => {
            if (this.state.sortColumn !== column) return '';
            return this.state.sortDirection === 'asc' ? ' ↑' : ' ↓';
        };

        return (
            <div className="tableau-root">
                <div className="tableau-filters">
                    <button className="tableau-icon-button" onClick={this.handleRefresh} aria-label="Refresh">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12a9 9 0 1 1-2.6-6.1" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 3v6h-6" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Rechercher prestation..."
                        value={this.state.filterName}
                        onChange={e => this.setState({ filterName: e.target.value, currentPage: 0 })}
                        className="tableau-filter-input"
                    />
                    <select
                        value={this.state.filterEtat}
                        onChange={e => this.setState({ filterEtat: e.target.value, currentPage: 0 })}
                        className="tableau-select"
                    >
                        <option value="">Tous</option>
                        {etats.map(etat => <option key={etat} value={etat}>{etat}</option>)}
                    </select>
                    <select
                        value={this.state.filterDomaine}
                        onChange={e => this.setState({ filterDomaine: e.target.value, currentPage: 0 })}
                        className="tableau-select"
                    >
                        <option value="">Tous</option>
                        {domaines.map(dom => <option key={dom} value={dom}>{dom}</option>)}
                    </select>
                    <select
                        value={this.state.filterClient}
                        onChange={e => this.setState({ filterClient: e.target.value, currentPage: 0 })}
                        className="tableau-select"
                    >
                        <option value="">Tous</option>
                        {clients.map(cli => <option key={cli} value={cli}>{cli}</option>)}
                    </select>
                </div>

                <table className="tableau-table">
                    <thead>
                        <tr>
                            <th className="tableau-th" onClick={() => this.handleSort('libEtat')}>État{getSortIndicator('libEtat')}</th>
                            <th className="tableau-th" onClick={() => this.handleSort('libSousDomaine')}>Domaine{getSortIndicator('libSousDomaine')}</th>
                            <th className="tableau-th" onClick={() => this.handleSort('libPrestation')}>Prestation{getSortIndicator('libPrestation')}</th>
                            <th className="tableau-th" onClick={() => this.handleSort('libRespPrestation')}>Responsable prestation{getSortIndicator('libRespPrestation')}</th>
                            <th className="tableau-th" onClick={() => this.handleSort('refPrestation')}>Code PAD{getSortIndicator('refPrestation')}</th>
                            <th className="tableau-th" onClick={() => this.handleSort('libClient')}>Client{getSortIndicator('libClient')}</th>
                            <th className="tableau-th">État de la phase en cours</th>
                            <th className="tableau-th">Voir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td className="tableau-cell" colSpan={9}>Aucun élément à afficher.</td>
                            </tr>
                        ) : paginatedData.map(item => (
                            <tr key={item.Guid} className="tableau-row" >
                                <td className="tableau-cell">
                                    <div className="tableau-etat-row">
                                        <button
                                            className={`tableau-fav-button ${this.isFavorite(item.Guid) ? 'favorited' : ''}`}
                                            onClick={() => this.handleProjectFavorisClick(item.Guid,item.idPrestation,item.libPrestation)}
                                            aria-pressed={this.isFavorite(item.Guid)}
                                            aria-label={this.isFavorite(item.Guid) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                        >
                                            {this.isFavorite(item.Guid) ? '★' : '☆'}
                                        </button>
                                        <span className="tableau-etat-text">{item.libEtat}</span>
                                        {getEtatIcon(item.libEtat)}
        
                                    </div>
                                </td>
                                <td className="tableau-cell">{item.libSousDomaine}</td>
                                <td className="tableau-cell tableau-bold">
                                    <div className="tableau-cell-title-wrap">
                                        
                                            {this.hasJalonsLivrables(item.jalonsLivrables, item.jalonsLivrables) ? (
                                                <span
                                                    className="tableau-title-yellow"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() =>
                                                        this.handleTooltipToggle(
                                                            item.Guid,
                                                            item.jalonsLivrables
                                                        )
                                                    }
                                                    aria-label="Voir les jalons et livrables"
                                                >
                                                    {item.libPrestation}
                                                </span>
                                            ) : (
                                                <span>{item.libPrestation}</span>
                                            )}


                                        {this.state.tooltipGuid === item.Guid && (
                                            <div className="tableau-tooltip">
                                                {this.state.tooltipData && this.state.tooltipData.length > 0 ? (
                                                <table className="tableau-tooltip-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Jalon / Livrable</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.tooltipData.map((j, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        {j.isLivrable ? "📦 " : "📍 "}
                                                                        {j.label}
                                                                        {j.notes && (
                                                                            <div className="tooltip-notes">
                                                                                {j.notes}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>{j.date ?? "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div>Jalons &amp; livrables disponibles</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="tableau-cell">{item.libRespPrestation}</td>
                                <td className="tableau-cell">{item.refPrestation}</td>
                                <td className="tableau-cell">{item.libClient}</td>
                                <td className="tableau-cell">{getMeteoIcon(item.Etat_Meteo)}</td>
                                
                                <td className="tableau-cell">
                                    <button className="tableau-icon-button" 
                                    onClick={() => this.handleProjectClick(item.Guid, item.idPrestation, item.libPrestation)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </td>  
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="tableau-pagination">
                    <button
                        onClick={() => this.handlePageChange('prev')}
                        disabled={this.state.currentPage === 0}
                        className="tableau-page-button"
                    >
                        <span className="tableau-page-arrow">←</span>
                        Précédent
                    </button>
                    <span className="tableau-page-info">Page {this.state.currentPage + 1} sur {totalPages}</span>
                    <button
                        onClick={() => this.handlePageChange('next')}
                        disabled={this.state.currentPage >= totalPages - 1}
                        className="tableau-page-button"
                    >
                        Suivant
                        <span className="tableau-page-arrow">→</span>
                    </button>
                </div>
            </div>
        );
    }
}

