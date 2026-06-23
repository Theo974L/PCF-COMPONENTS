import { Nullable } from "./types";

export interface JalonsRow {
  id: string;
  name: string;

  planning: Nullable<boolean>;
  livrable: Nullable<boolean>;
  statut: boolean;
  /** Statut texte pour les livrables : "En attente" | "En cours" | "Réalisé" */
  statutLibelle: string;

  datePrevue: Nullable<Date>;
  dateActualisee: Nullable<Date>;
  delta: Nullable<number>;

  demandeEquipier: Nullable<string>;
  isRespInterne: boolean;

  commentaire: string;
  isDirty: boolean;
}
