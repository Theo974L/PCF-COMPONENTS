import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { PlanningTable } from "./components/PlanningTable";
import { MappingService } from "./services/MappingService";
import { DataverseService } from "./services/DataverseService";
import { JalonsApi } from "./models/JalonsApi";
import { JalonsRow } from "./models/JalonsRow";
import { usePlanning } from "./hooks/usePlanning";

// ✅ typage dataset record PCF
type PCFRecord = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;


interface RootProps {
  rows: ReturnType<typeof MappingService.mapFromApi>;
  service: DataverseService;
}


const RootComponent: React.FC<RootProps> = ({ rows, service }) => {

  const {
    rows: data,
    updateField,
    toggleImmediate,
    save
  } = usePlanning(rows, service);

  const planningTable = PlanningTable({
    rows: data,
    updateField,
    toggleImmediate,
    save
  });

  return (
    planningTable
  );
};

export class TableauJalon
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private root!: ReactDOM.Root;

  
   public init(
       context: ComponentFramework.Context<IInputs>,
       notifyOutputChanged: () => void,
       state: ComponentFramework.Dictionary,
       container: HTMLDivElement
   ): void {
       this.root = ReactDOM.createRoot(container);
   }


  
public updateView(context: ComponentFramework.Context<IInputs>): void {

    const json = context.parameters.JalonsDataJson.raw;

    if (!json) return;

    let parsed: JalonsApi[];

    try {
      parsed = JSON.parse(json);
    } catch (e) {
      console.error("JSON invalide", e);
      return;
    }

    const rows = MappingService.mapFromApi(parsed);

    const service = new DataverseService(context);

    this.root.render(
      React.createElement(RootComponent, {
        rows,
        service
      })
    );
  }


  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    this.root.unmount();
  }
}