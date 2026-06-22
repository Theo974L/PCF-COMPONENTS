import { Nullable } from "./types";

export interface JalonsRow {
  id: string;
  name: string;

  planning: Nullable<boolean>;
  livrable: Nullable<boolean>;
  statut: boolean;

  datePrevue: Nullable<Date>;
  dateActualisee: Nullable<Date>;

  delta: Nullable<number>;

  demandeEquipier: Nullable<string>;
  isRespInterne: boolean;

  isDirty: boolean;
}