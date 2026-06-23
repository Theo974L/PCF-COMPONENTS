import { useCallback, useEffect, useState } from "react";
import { JalonsRow } from "../models/JalonsRow";
import { DataverseService } from "../services/DataverseService";

export const usePlanning = (
  initialRows: JalonsRow[],
  service: DataverseService,
  onDeleteRequest: (id: string) => void,
  onCommentSave: (id: string, text: string) => void,
) => {
  const [rows, setRows] = useState<JalonsRow[]>([]);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const updateField = useCallback(
    <K extends keyof JalonsRow>(id: string, field: K, value: JalonsRow[K]) => {
      setRows(prev =>
        prev.map(r => (r.id === id ? { ...r, [field]: value, isDirty: true } : r))
      );
    },
    []
  );

  const saveRow = useCallback(
    async (id: string) => {
      setRows(prev => {
        const row = prev.find(r => r.id === id);
        if (row?.isDirty) {
          service.updateRow(row).catch(console.error);
          return prev.map(r => (r.id === id ? { ...r, isDirty: false } : r));
        }
        return prev;
      });
    },
    [service]
  );

  const toggleImmediate = useCallback(
    async (id: string, field: "planning" | "livrable", value: boolean) => {
      setRows(prev =>
        prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
      );
      const apiField = field === "planning" ? "cre69_planning" : "cre69_livrable";
      await service.updateField(id, { [apiField]: value });
    },
    [service]
  );

  const saveComment = useCallback(
    async (id: string, text: string) => {
      setRows(prev =>
        prev.map(r => (r.id === id ? { ...r, commentaire: text } : r))
      );
      await service.updateComment(id, text);
      onCommentSave(id, text);
    },
    [service, onCommentSave]
  );

  const requestDelete = useCallback(
    (id: string) => {
      onDeleteRequest(id);
    },
    [onDeleteRequest]
  );

  return { rows, updateField, saveRow, toggleImmediate, saveComment, requestDelete };
};
