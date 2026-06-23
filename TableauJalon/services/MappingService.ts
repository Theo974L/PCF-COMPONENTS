import { JalonsRow } from "../models/JalonsRow";
import { JalonsApi } from "../models/JalonsApi";

export class MappingService {
  static mapFromApi(data: JalonsApi[]): JalonsRow[] {
    return data.map((item: JalonsApi) => ({
      id: item.cr9e8_jalonsid,
      name: item.cr9e8_name,

      planning: item.cre69_planning,
      livrable: item.cre69_livrable,
      statut: item.cr9e8_statut,
      statutLibelle: item.cre69_statut_libelle ?? "En attente",

      datePrevue: item.cr9e8_date_de_fin_initiale
        ? new Date(item.cr9e8_date_de_fin_initiale)
        : null,
      dateActualisee: item.cr9e8_date_de_fin_actualisee
        ? new Date(item.cr9e8_date_de_fin_actualisee)
        : null,

      delta: item.cre69_delta_date,
      demandeEquipier: item.cre69_demandeequipier,
      isRespInterne: item.cre69_isrespinterne,

      commentaire: item.cre69_commentaire ?? "",
      isDirty: false,
    }));
  }
}
