import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { PlanningTable } from "./components/PlanningTable";
import { MappingService } from "./services/MappingService";
import { DataverseService } from "./services/DataverseService";
import { JalonsApi } from "./models/JalonsApi";
import { PersonneApi } from "./models/PersonneApi";
import { JalonsRow } from "./models/JalonsRow";
import { usePlanning } from "./hooks/usePlanning";

// ── Root wrapper ──────────────────────────────────────────────────────────────

interface RootProps {
  rows: JalonsRow[];
  personnes: PersonneApi[];
  service: DataverseService;
  onDeleteRequest: (id: string) => void;
  onCommentSave: (id: string, text: string) => void;
}

const RootComponent: React.FC<RootProps> = ({
  rows,
  personnes,
  service,
  onDeleteRequest,
  onCommentSave,
}) => {
  const { rows: data, updateField, saveRow, toggleImmediate, saveComment, requestDelete } =
    usePlanning(rows, service, onDeleteRequest, onCommentSave);

  return React.createElement(PlanningTable, {
    rows: data,
    personnes,
    updateField,
    saveRow,
    toggleImmediate,
    saveComment,
    requestDelete,
  });
};

// ── PCF Control ───────────────────────────────────────────────────────────────

export class TableauJalon
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private root!: ReactDOM.Root;
  private notifyOutputChanged!: () => void;
  private context!: ComponentFramework.Context<IInputs>;

  // Outputs
  private _selectedRowGUID = "";
  private _commentRowGUID = "";
  private _commentText = "";

  // Cache pour éviter les re-renders inutiles
  private _lastJalonsJson: string | null = null;
  private _lastPersonneJson: string | null = null;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
    this.root = ReactDOM.createRoot(container);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.context = context;

    const jalonsJson = context.parameters.JalonsDataJson.raw ?? "";
    const personneJson = context.parameters.PersonneDataJson.raw ?? "";

    // Ne re-render que si les données changent
    if (
      jalonsJson === this._lastJalonsJson &&
      personneJson === this._lastPersonneJson
    ) {
      return;
    }

    this._lastJalonsJson = jalonsJson;
    this._lastPersonneJson = personneJson;

    let parsedJalons: JalonsApi[] = [];
    try {
      if (jalonsJson) parsedJalons = JSON.parse(jalonsJson);
    } catch (e) {
      console.error("[TableauJalon] JalonsDataJson invalide", e);
    }

    let parsedPersonnes: PersonneApi[] = [];
    try {
      if (personneJson) parsedPersonnes = JSON.parse(personneJson);
    } catch (e) {
      console.error("[TableauJalon] PersonneDataJson invalide", e);
    }

    const rows = MappingService.mapFromApi(parsedJalons);
    const service = new DataverseService(context);

    this.root.render(
      React.createElement(RootComponent, {
        rows,
        personnes: parsedPersonnes,
        service,
        onDeleteRequest: (id: string) => {
          this._selectedRowGUID = id;
          this.notifyOutputChanged();
          // Déclenche l'event Power Apps OnClickTrash
          try {
            (this.context.events as Record<string, (name: string) => void>)["fireEvent"]("OnClickTrash");
          } catch {
            // Ignoré si non supporté en mode test
          }
        },
        onCommentSave: (id: string, text: string) => {
          this._commentRowGUID = id;
          this._commentText = text;
          this.notifyOutputChanged();
          try {
            (this.context.events as Record<string, (name: string) => void>)["fireEvent"]("OnCommentSave");
          } catch {
            // Ignoré si non supporté en mode test
          }
        },
      })
    );
  }

  public getOutputs(): IOutputs {
    return {
      SelectedRowGUID: this._selectedRowGUID,
      CommentRowGUID: this._commentRowGUID,
      CommentText: this._commentText,
    };
  }

  public destroy(): void {
    this.root.unmount();
  }
}
