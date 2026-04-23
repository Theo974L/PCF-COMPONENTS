
import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TableauComponent } from "./Tableau";
import { ITableauProps } from "./interface/ui/ITableauProps";

import "../styles.css";


export class Tableau implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedGuid: string | undefined;
    private favoritesJson: string | undefined;
    private actionJson: string | undefined;
    private selectedIdPrestation: string | undefined;
    private selectedLibPrestation: string | undefined;
    private context?: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    
    
    public init(
        _context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    private projectSelectEvent(): void {

        const onProjectSelectEvent = this.context?.events?.OnProjectSelect;

        if (typeof onProjectSelectEvent !== "function") return;

        try {
            onProjectSelectEvent();
        } catch {
            // ignore event invocation errors and keep output flow active
        }
    }

    private projectFavorisToggleEvent(): void {

        const onProjectFavorisSelectEvent = this.context?.events?.OnProjectFavorisToggle;
        
        if (typeof onProjectFavorisSelectEvent !== "function") return;

        try {
            onProjectFavorisSelectEvent();
        } catch {
            // ignore event invocation errors and keep output flow active
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    
public updateView(
        context: ComponentFramework.Context<IInputs>
    ): React.ReactElement {


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
                
                context?.events?.OnProjectSelect?.(payload);
                this.projectSelectEvent();

                this.notifyOutputChanged();
            },
            onProjectFavorisToggle: (payload: { guid: string; idPrestation: string; libPrestation: string  }) => {
                
                const { guid, idPrestation, libPrestation } = payload;
                
                // mise a jour
                this.selectedGuid = guid;
                this.selectedIdPrestation = idPrestation;
                this.selectedLibPrestation = libPrestation;
                
                // on notify powerapps
                this.notifyOutputChanged();

                // on declenche l'event pour le wrapper PCF
                context?.events?.OnProjectFavorisToggle?.({
                    guid: this.selectedGuid,
                    idPrestation: this.selectedIdPrestation,
                    libPrestation: this.selectedLibPrestation
                });                
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


        return React.createElement<ITableauProps>(
            TableauComponent,
            props
        );


    }

   

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    
    
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
            selectedLibPrestation: this.selectedLibPrestation
        };
    }
    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}