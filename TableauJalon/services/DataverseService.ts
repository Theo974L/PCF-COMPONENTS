import { JalonsRow } from "../models/JalonsRow";

export class DataverseService {
  constructor(private context: ComponentFramework.Context<unknown>) {}

  async updateRow(row: JalonsRow): Promise<void> {
    await this.context.webAPI.updateRecord("cr9e8_jalons", row.id, {
      cr9e8_name: row.name,
      cr9e8_date_de_fin_initiale: row.datePrevue?.toISOString() ?? null,
      cr9e8_date_de_fin_actualisee: row.dateActualisee?.toISOString() ?? null,
      cr9e8_statut: row.statut,
      cre69_statut_libelle: row.statutLibelle,
      cre69_demandeequipier: row.demandeEquipier,
    });
  }

  async updateField(id: string, payload: Record<string, unknown>): Promise<void> {
    await this.context.webAPI.updateRecord("cr9e8_jalons", id, payload);
  }

  async updateComment(id: string, commentaire: string): Promise<void> {
    await this.context.webAPI.updateRecord("cr9e8_jalons", id, {
      cre69_commentaire: commentaire,
    });
  }
}
