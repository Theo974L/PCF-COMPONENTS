import { JalonsRow } from "../models/JalonsRow";

export class DataverseService {
  constructor(private context: ComponentFramework.Context<unknown>) {}

  async updateRow(row: JalonsRow): Promise<void> {
    await this.context.webAPI.updateRecord(
      "cr9e8_jalons",
      row.id,
      {
        cr9e8_name: row.name,
        cr9e8_date_de_fin_initiale: row.datePrevue?.toISOString(),
        cr9e8_date_de_fin_actualisee: row.dateActualisee?.toISOString(),
        cr9e8_statut: row.statut
      }
    );
  }

  async updateToggle(
    id: string,
    field: "cre69_planning" | "cre69_livrable",
    value: boolean
  ): Promise<void> {
    await this.context.webAPI.updateRecord(
      "cr9e8_jalons",
      id,
      {
        value
      }
    );
  }
}