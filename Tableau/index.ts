import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import "../styles.css";
import { NotifyComponent } from "./Notify";

export class Tableau implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        _notifyOutputChanged: () => void
    ): void {
        // Aucune sortie n'est utilisée dans ce contrôle pour le moment.
    }

    public updateView(
        context: ComponentFramework.Context<IInputs>
    ): React.ReactElement {
        return React.createElement(NotifyComponent, {
            notificationType: context.parameters.notificationType?.raw ?? "",
            notificationTitle: context.parameters.notificationTitle?.raw ?? "",
            notificationIcon: context.parameters.notificationIcon?.raw ?? "",
            notificationMessage: context.parameters.notificationMessage?.raw ?? "",
            notificationPosition: context.parameters.notificationPosition?.raw ?? "top-right",
            notificationTheme: context.parameters.notificationTheme?.raw ?? "colored",
            notificationCloseOnClick: context.parameters.notificationCloseOnClick?.raw ?? "true",
            notificationPauseOnHover: context.parameters.notificationPauseOnHover?.raw ?? "true",
            notificationHideProgressBar: context.parameters.notificationHideProgressBar?.raw ?? "false",
            notificationActionUrl: context.parameters.notificationActionUrl?.raw ?? "",
            notificationTrigger: context.parameters.notificationTrigger?.raw ?? "",
            notificationAutoClose: context.parameters.notificationAutoClose?.raw ?? 5000
        });
    }

    public getOutputs(): IOutputs {
        return {
            
        };
    }

    public destroy(): void {
        // cleanup if needed
    }
}