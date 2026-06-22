import * as React from "react";
import { JalonsRow } from "../models/JalonsRow";
import { computeDelta } from "../utils/dateUtils";

interface Props {
  rows: JalonsRow[];
  updateField: <K extends keyof JalonsRow>(
    id: string,
    field: K,
    value: JalonsRow[K]
  ) => void;
  toggleImmediate: (
    id: string,
    field: "planning" | "livrable",
    value: boolean
  ) => void;
  save: () => void;
}

export const PlanningTable: React.FC<Props> = ({
  rows,
  updateField,
  toggleImmediate,
  save
}) => {

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  return (
    <div className="container">

      <table className="table">
        <thead>
          <tr>
            <th>Planning</th>
            <th>Jalons & Livrables</th>
            <th>Livrable</th>
            <th>Nom du Resp.</th>
            <th>Date prévue</th>
            <th>Date actualisée</th>
            <th>Delta Date</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr key={row.id}>

              {/* Toggle Planning */}
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={row.planning ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      toggleImmediate(row.id, "planning", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </td>

              {/* Nom */}
              <td>
                <input
                  className="input"
                  value={row.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField(row.id, "name", e.target.value)
                  }
                />
              </td>

              {/* Toggle livrable */}
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={row.livrable ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      toggleImmediate(row.id, "livrable", e.target.checked)
                    }
                  />
                  <span className="slider red"></span>
                </label>
              </td>

              {/* Resp */}
              <td>
                <select
                  className="input"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateField(row.id, "demandeEquipier", e.target.value)
                  }
                >
                  <option>EXTERNE</option>
                  <option>Eric ALLIER</option>
                  <option>Rémi ABDOLA</option>
                </select>
              </td>

              {/* Date prévue */}
              <td>
                <input
                  type="date"
                  className="input"
                  value={formatDate(row.datePrevue)}
                  onChange={(e) =>
                    updateField(
                      row.id,
                      "datePrevue",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
              </td>

              {/* Date actualisée */}
              <td>
                <input
                  type="date"
                  className="input"
                  value={formatDate(row.dateActualisee)}
                  onChange={(e) =>
                    updateField(
                      row.id,
                      "dateActualisee",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
              </td>

              {/* Delta */}
              <td>
                {computeDelta(row.datePrevue, row.dateActualisee)}
              </td>

              {/* Statut */}
              <td>
                <select
                  className="input"
                  value={row.statut ? "ok" : "todo"}
                  onChange={(e) =>
                    updateField(row.id, "statut", e.target.value === "ok")
                  }
                >
                  <option value="todo">A faire</option>
                  <option value="wait">En attente</option>
                  <option value="ok">En cours</option>
                </select>
              </td>

              {/* Actions */}
              <td className="actions">
                💬 🗑
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <button className="save" onClick={save}>
        Sauvegarder
      </button>
    </div>
  );
};