export interface JalonsApi {
  cr9e8_jalonsid: string;
  cr9e8_name: string;

  cr9e8_statut: boolean;

  cr9e8_date_de_fin_initiale: string | null;
  cr9e8_date_de_fin_actualisee: string | null;

  cre69_delta_date: number | null;

  cre69_demandeequipier: string | null;

  cre69_isrespinterne: boolean;
  cre69_livrable: boolean | null;
  cre69_planning: boolean | null;
}