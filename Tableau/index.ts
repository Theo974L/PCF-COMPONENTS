import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TableauComponent } from "./Tableau";
import { ITableauProps } from "./interface/ui/ITableauProps";

import "../styles.css";

export class Tableau implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged!: () => void;
    private selectedGuid: string | undefined;
    private favoritesJson: string | undefined;
    private actionJson: string | undefined;
    private selectedIdPrestation: string | undefined;
    private selectedLibPrestation: string | undefined;
    private context?: ComponentFramework.Context<IInputs>;
    
    private pendingFavorisEvent = false;
    private favIdPrestation: string | undefined;
    private favLibPrestation: string | undefined;
    private favAction: string | undefined;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    public updateView(
        context: ComponentFramework.Context<IInputs>
    ): React.ReactElement {
        // ✅ Toujours garder le contexte courant
        this.context = context;

        
        
        if (this.pendingFavorisEvent) {
            this.pendingFavorisEvent = false;
            setTimeout(() => this.context?.events?.OnProjectFavorisToggle?.(), 0);
        }



        const props: ITableauProps = {
            dataJson: context.parameters.dataJson.raw ?? "[]",
            favoritesDataJson: context.parameters.favoritesDataJson?.raw ?? "[]",
            jalonsLivrables: context.parameters.jalonsLivrables?.raw ?? "[]",
            nbItems: context.parameters.nbItems.raw ?? 5,

            onProjectSelect: (payload: { guid: string; idPrestation: string; libPrestation: string }) => {
                const { guid, idPrestation, libPrestation } = payload;

                this.selectedGuid = guid;
                this.selectedIdPrestation = idPrestation;
                this.selectedLibPrestation = libPrestation;

                
                this.notifyOutputChanged();
            },

            onProjectFavorisToggle: (payload: { guid: string; idPrestation: string; libPrestation: string }) => {
                const { guid, idPrestation, libPrestation } = payload;


                this.selectedGuid = guid;
                this.selectedIdPrestation = idPrestation;
                this.selectedLibPrestation = libPrestation;

                this.favIdPrestation = idPrestation;
                this.favLibPrestation = libPrestation;
                this.favAction = "TOGGLE";

                this.pendingFavorisEvent = true;

                this.notifyOutputChanged();
            },

            onFavoritesChange: (favorites: string[]) => {
                this.favoritesJson = this.safeJson(favorites);
                this.notifyOutputChanged();
            },

            onAction: (action: unknown) => {
                this.actionJson = this.safeJson(action);
                this.notifyOutputChanged();
            },

            onSelectGuid: (guid: string) => {
                this.selectedGuid = guid;
                this.notifyOutputChanged();
            }
        };

        return React.createElement<ITableauProps>(TableauComponent, props);
    }

    private safeJson(value: unknown): string | undefined {
        try {
            return JSON.stringify(value);
        } catch {
            return undefined;
        }
    }

    public getOutputs(): IOutputs {
        return {
            selectedIdPrestation: this.selectedIdPrestation,
            selectedGuid: this.selectedGuid,
            favoritesJson: this.favoritesJson,
            actionJson: this.actionJson,
            selectedLibPrestation: this.selectedLibPrestation,
            favIdPrestation: this.favIdPrestation,
            favLibPrestation: this.favLibPrestation,
            favAction: this.favAction
        };
    }

    public destroy(): void {
        // cleanup if needed
    }
}