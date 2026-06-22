import * as React from "react";
import { JalonsRow } from "../models/JalonsRow";
import { computeDelta } from "../utils/dateUtils";
import "./style.css";

interface Props {
  rows: JalonsRow[];
  updateField: any;
  toggleImmediate: any;
  save: () => void;
}

export const PlanningTable: React.FC<Props> = ({
  rows,
  updateField,
  toggleImmediate,
  save
}) => {

  const [externalMode, setExternalMode] = React.useState<Record<string, boolean>>({});
  const [commentRow, setCommentRow] = React.useState<string | null>(null);

  const formatDate = (d: Date | null) =>
    d ? d.toISOString().split("T")[0] : "";

  return (
    <div className="wrapper">

      {/* HEADER */}
      <div className="grid header">
        <div>Planning</div>
        <div>Jalons & Livrables</div>
        <div>Livrable</div>
        <div>Nom du Resp.</div>
        <div>Date prévue</div>
        <div>Date actualisée</div>
        <div>Δ</div>
        <div>Statut</div>
        <div></div>
      </div>

      {/* ROWS */}
      {rows.map(row => {
        const delta = computeDelta(row.datePrevue, row.dateActualisee);

        return (
          <div key={row.id} className="grid row">

            {/* Planning */}
            <div>
              <input
                type="checkbox"
                className="toggle"
                checked={row.planning ?? false}
                onChange={e =>
                  toggleImmediate(row.id, "planning", e.target.checked)
                }
              />
            </div>

            {/* Nom */}
            <div>
              <input
                className="input"
                value={row.name}
                onChange={e =>
                  updateField(row.id, "name", e.target.value)
                }
              />
            </div>

            {/* Livrable */}
            <div>
              <input
                type="checkbox"
                className="toggle red"
                checked={row.livrable ?? false}
                onChange={e =>
                  toggleImmediate(row.id, "livrable", e.target.checked)
                }
              />
            </div>

            {/* Resp */}
            <div className="resp">
              {externalMode[row.id] ? (
                <input
                  className="input"
                  placeholder="Externe..."
                  onChange={e =>
                    updateField(row.id, "demandeEquipier", e.target.value)
                  }
                />
              ) : (
                <select
                  className="input"
                  onChange={e =>
                    updateField(row.id, "demandeEquipier", e.target.value)
                  }
                >
                  <option>Eric ALLIER</option>
                  <option>Christian AMBRUN</option>
                </select>
              )}

              <span
                className="icon"
                onClick={() =>
                  setExternalMode(p => ({
                    ...p,
                    [row.id]: !p[row.id]
                  }))
                }
              >
                👤+
              </span>
            </div>

            {/* Date prévue */}
            <div className="date">
              <input type="date" className="input" value={formatDate(row.datePrevue)} />
              <div className="calendar"></div>
            </div>

            {/* Date actualisée */}
            <div className="date">
              <input type="date" className="input" value={formatDate(row.dateActualisee)} />
              <div className="calendar"></div>
            </div>

            {/* Delta */}
            <div>
              {delta ?? ""}
            </div>

            {/* Statut */}
            <div>
              {!row.livrable ? (
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    checked={row.statut}
                    onChange={e =>
                      updateField(row.id, "statut", e.target.checked)
                    }
                  />
                  <span>{row.statut ? "Réalisé" : "A faire"}</span>
                </div>
              ) : (
                <select className="input">
                  <option>En attente</option>
                  <option>En cours</option>
                  <option>Réalisé</option>
                </select>
              )}
            </div>

            {/* Actions */}
            <div className="actions">
              <span onClick={() => setCommentRow(row.id)}>💬</span>
              <span>🗑</span>
            </div>

          </div>
        );
      })}

      <button className="save" onClick={save}>Sauvegarder</button>

      {/* MODAL */}
      {commentRow && (
        <div className="modal">
          <div className="modalBox">
            <textarea className="textarea"></textarea>
            <button onClick={() => setCommentRow(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};