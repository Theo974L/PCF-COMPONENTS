import * as React from "react";
import { JalonsRow } from "../models/JalonsRow";
import { computeDelta } from "../utils/dateUtils";
import "../assets/tailwind.css";

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
    <div className="p-4 bg-gray-100 min-h-screen">
  {/* HEADER */}
  <div className="grid grid-cols-12 gap-2 bg-gray-800 text-white text-sm font-semibold p-4">
    <div>Planning</div>
    <div className="col-span-3">Jalons & Livrables</div>
    <div>Livrable</div>
    <div className="col-span-2">Nom du Resp.</div>
    <div>Date prévue</div>
    <div>Date actualisée</div>
    <div>Delta</div>
    <div>Statut</div>
    <div>Actions</div>
  </div>

  {/* ROWS */}
  {rows.map(row => {
    const delta = computeDelta(row.datePrevue, row.dateActualisee);

    return (
      <div
        key={row.id}
        className="grid grid-cols-12 gap-2 items-center bg-white p-3 border-b hover:bg-gray-100 transition"
      >
        {/* Planning */}
        <div className="flex items-center justify-center">
            <input
          type="checkbox"
          className="w-5 h-5 accent-blue-600"
          checked={row.planning ?? false}
          onChange={e =>
            toggleImmediate(row.id, "planning", e.target.checked)
          }
        />
        </div>
        


        {/* Nom */}
          <div className="col-span-3 flex items-center gap-2">
            <input
            className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 outline-none"
            value={row.name}
            onChange={e =>
                updateField(row.id, "name", e.target.value)
            }
            />
          </div>
        

        {/* Livrable */}
        <div className="flex items-center justify-center">
            <input
          type="checkbox"
          className="w-5 h-5 accent-red-500"
          checked={row.livrable ?? false}
          onChange={e =>
            toggleImmediate(row.id, "livrable", e.target.checked)
          }
        />
        </div>
        

        {/* Responsable */}
        <div className="flex items-center gap-1 col-span-2">
          {externalMode[row.id] ? (
            <input
              className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
              placeholder="Externe..."
              onChange={e =>
                updateField(row.id, "demandeEquipier", e.target.value)
              }
            />
          ) : (
            <select
              className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
              onChange={e =>
                updateField(row.id, "demandeEquipier", e.target.value)
              }
            >
              <option>Eric ALLIER</option>
              <option>Christian AMBRUN</option>
            </select>
          )}
          <button
            className="text-gray-500 hover:text-blue-600"
            onClick={() =>
              setExternalMode(p => ({
                ...p,
                [row.id]: !p[row.id]
              }))
            }
          >
            👤
          </button>
        </div>

        {/* Date prévue */}
        <input
          type="date"
          className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
          value={formatDate(row.datePrevue)}
        />

        {/* Date actualisée */}
        <input
          type="date"
          className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
          value={formatDate(row.dateActualisee)}
        />

        {/* Delta */}
        <div className={`${delta ? delta > 0 ? "text-red-500" : "text-green-600" : ""} font-semibold`}>
          {delta ?? ""}
        </div>

        {/* Statut */}
        {!row.livrable ? (
          <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-600"
              checked={row.statut}
              onChange={e =>
                updateField(row.id, "statut", e.target.checked)
              }
            />
            <span>
              {row.statut ? "Réalisé" : "A faire"}
            </span>
          </label>
        ) : (
          <select className="border rounded-lg px-2 py-1">
            <option>En attente</option>
            <option>En cours</option>
            <option>Réalisé</option>
          </select>
        )}

        {/* Actions */}
        <div className="flex gap-3 text-lg justify-center items-center ">
          <button onClick={() => setCommentRow(row.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-18 w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </button>
          <button className="hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-18 w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    );
  })}

  {/* SAVE */}
  <div className="mt-4 text-right">
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      onClick={save}
    >
      Sauvegarder
    </button>
  </div>

  {/* MODAL */}
  {commentRow && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-4 w-96 shadow-lg">
        <textarea
          className="w-full border rounded-lg p-2 h-32 focus:ring-2 focus:ring-blue-400"
          placeholder="Ajouter un commentaire..."
        />
        <div className="text-right mt-3">
          <button
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            onClick={() => setCommentRow(null)}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};