import { useEffect, useState } from "react";
import { JalonsRow } from "../models/JalonsRow";
import { DataverseService } from "../services/DataverseService";

export const usePlanning = (
  initialRows: JalonsRow[],
  service: DataverseService
) => {

  const [rows, setRows] = useState<JalonsRow[]>([]);

  // ✅ init UNE seule fois ou quand dataset change
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const updateField = <K extends keyof JalonsRow>(
    id: string,
    field: K,
    value: JalonsRow[K]
  ) => {
    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, value, isDirty: true }
          : r
      )
    );
  };

  const toggleImmediate = async (
    id: string,
    field: "planning" | "livrable",
    value: boolean
  ): Promise<void> => {

    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, value }
          : r
      )
    );

    await service.updateToggle(
      id,
      field === "planning" ? "cre69_planning" : "cre69_livrable",
      value
    );
  };

  const save = async (): Promise<void> => {
    const dirtyRows = rows.filter(r => r.isDirty);

    await Promise.all(
      dirtyRows.map(r => service.updateRow(r))
    );

    setRows(prev =>
      prev.map(r => ({ ...r, isDirty: false }))
    );
  };

  return {
    rows,
    updateField,
    toggleImmediate,
    save
  };
};