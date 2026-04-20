import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TableauComponent } from "./Tableau";
import { ITableauProps } from "./interfaces";
import * as React from "react";
import "../styles.css";

export class Tableau implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedGuid: string | undefined;
    private favoritesJson: string | undefined;
    private actionJson: string | undefined;
    private onSelect: string | undefined;

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
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // If the Canvas app set ackOnSelect to the currently published onSelect GUID,
        // clear the onSelect output so the app can acknowledge consumption.
        const ack = context.parameters.ackOnSelect?.raw;
        if (ack && this.onSelect && ack === this.onSelect) {
            this.onSelect = undefined;
            this.selectedGuid = undefined;
            this.notifyOutputChanged();
        }
        const props: ITableauProps = {
            dataJson: context.parameters.dataJson.raw ?? "[]",
            favoritesDataJson: context.parameters.favoritesDataJson?.raw ?? "[]",
            onSelectGuid: (guid: string) => {
                this.selectedGuid = guid;
                this.onSelect = guid;
                this.notifyOutputChanged();
            }
            ,
            onFavoritesChange: (favorites: string[]) => {
                try {
                    this.favoritesJson = JSON.stringify(favorites || []);
                } catch {
                    this.favoritesJson = undefined;
                }
                this.notifyOutputChanged();
            }
            ,
            onAction: (action) => {
                try {
                    this.actionJson = JSON.stringify(action || {});
                } catch {
                    this.actionJson = undefined;
                }
                this.notifyOutputChanged();
            }
        };
        return React.createElement(
            TableauComponent, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            selectedGuid: this.selectedGuid
            , onSelect: this.onSelect
            , favoritesJson: this.favoritesJson
            , actionJson: this.actionJson
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
