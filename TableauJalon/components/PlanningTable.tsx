import * as React from "react";
import { JalonsRow } from "../models/JalonsRow";
import { PersonneApi } from "../models/PersonneApi";
import "../assets/tailwind.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (d: Date | null): string =>
  d ? d.toISOString().split("T")[0] : "";

const parseDate = (s: string): Date | null => (s ? new Date(s) : null);

const isDemande = (name: string) => name.startsWith("Demande d'équipier");

const isRowRealise = (row: JalonsRow): boolean =>
  row.livrable ? row.statutLibelle === "Réalisé" : row.statut === true;

// ── Toggle ────────────────────────────────────────────────────────────────────

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  colorOn?: string;
}> = ({ checked, onChange, disabled = false, colorOn = "#dc2626" }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    aria-checked={checked}
    role="switch"
    style={{
      position: "relative",
      display: "inline-flex",
      width: 40,
      height: 20,
      borderRadius: 10,
      border: "none",
      padding: 0,
      backgroundColor: checked ? colorOn : "#d1d5db",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "background-color 0.2s ease",
      flexShrink: 0,
      outline: "none",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 2,
        left: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease",
        transform: checked ? "translateX(20px)" : "translateX(0px)",
      }}
    />
  </button>
);

// ── Delta badge ───────────────────────────────────────────────────────────────

const DeltaBadge: React.FC<{ delta: number | null }> = ({ delta }) => {
  if (delta === null || delta === undefined)
    return <span style={{ color: "#9ca3af" }}>—</span>;
  const color = delta > 0 ? "#dc2626" : delta < 0 ? "#16a34a" : "#6b7280";
  return (
    <span style={{ color, fontWeight: 600 }}>
      {delta > 0 ? `+${delta}` : delta}
    </span>
  );
};

// ── Personne combobox ─────────────────────────────────────────────────────────

const PersonneCombobox: React.FC<{
  value: string;
  personnes: PersonneApi[];
  onChange: (nom: string) => void;
  onBlur: () => void;
}> = ({ value, personnes, onChange, onBlur }) => {
  const [query, setQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { setQuery(value); }, [value]);

  const filtered = React.useMemo(
    () => personnes.filter(p => p.nom.toLowerCase().includes(query.toLowerCase())),
    [personnes, query]
  );

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onBlur]);

  const select = (nom: string) => {
    setQuery(nom);
    onChange(nom);
    setOpen(false);
    onBlur();
  };

  return (
    <div ref={containerRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={{ position: "relative" }}>
        <input
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "5px 28px 5px 10px",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            color: "#1f2937",
            backgroundColor: "#fff",
          }}
          value={query}
          placeholder="Rechercher…"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
          backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 180, overflowY: "auto", marginTop: 2,
        }}>
          {filtered.length === 0
            ? <div style={{ padding: "8px 12px", fontSize: 12, color: "#9ca3af" }}>Aucun résultat</div>
            : filtered.map(p => (
              <div
                key={p.id}
                onMouseDown={() => select(p.nom)}
                style={{
                  padding: "7px 12px", fontSize: 13, cursor: "pointer",
                  color: p.nom === value ? "#dc2626" : "#374151",
                  fontWeight: p.nom === value ? 600 : 400,
                  backgroundColor: "transparent", transition: "background-color 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {p.nom}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

// ── Comment Modal ─────────────────────────────────────────────────────────────

const CommentModal: React.FC<{ row: JalonsRow; onSave: (text: string) => void; onClose: () => void }> = ({ row, onSave, onClose }) => {
  const [draft, setDraft] = React.useState(row.commentaire);
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: 480, maxWidth: "calc(100vw - 32px)", overflow: "hidden" }}>
        <div style={{ backgroundColor: "#1f2937", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Commentaire — {row.name}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <textarea
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, fontSize: 13, height: 140, resize: "none", outline: "none", boxSizing: "border-box", color: "#374151" }}
            placeholder="Saisir un commentaire…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <button onClick={onClose} style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#6b7280", cursor: "pointer" }}>Annuler</button>
            <button onClick={() => onSave(draft)} style={{ padding: "8px 20px", fontSize: 13, borderRadius: 8, border: "none", backgroundColor: "#dc2626", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────

const DeleteModal: React.FC<{ rowName: string; onConfirm: () => void; onClose: () => void }> = ({ rowName, onConfirm, onClose }) => (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.4)" }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: 420, maxWidth: "calc(100vw - 32px)", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#dc2626", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Confirmer la suppression</span>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
          Voulez-vous supprimer <strong>«&nbsp;{rowName}&nbsp;»</strong> ?
          <br /><span style={{ fontSize: 12, color: "#9ca3af" }}>Cette action sera traitée dans Power Apps.</span>
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#6b7280", cursor: "pointer" }}>Annuler</button>
          <button onClick={onConfirm} style={{ padding: "8px 20px", fontSize: 13, borderRadius: 8, border: "none", backgroundColor: "#dc2626", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Supprimer</button>
        </div>
      </div>
    </div>
  </div>
);

// ── Sort ──────────────────────────────────────────────────────────────────────

type SortField = "name" | "datePrevue" | "dateActualisee" | "delta" | "statut";
type SortDir = "asc" | "desc";
interface SortState { field: SortField | null; dir: SortDir; }

// ── Sort icon ─────────────────────────────────────────────────────────────────

const SortIcon: React.FC<{ dir: SortDir | null }> = ({ dir }) => (
  <svg
    width="11" height="11" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
    stroke={dir ? "#f87171" : "#6b7280"}
    style={{ flexShrink: 0, transition: "transform 0.2s", transform: dir === "desc" ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

// ── Header cell ───────────────────────────────────────────────────────────────

const Th: React.FC<{
  children: React.ReactNode;
  center?: boolean;
  sortable?: boolean;
  sortDir?: SortDir | null;
  onSort?: () => void;
}> = ({ children, center, sortable, sortDir, onSort }) => (
  <div
    onClick={sortable ? onSort : undefined}
    style={{
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: sortDir ? "#fca5a5" : "#d1d5db",
      userSelect: "none",
      textAlign: center ? "center" : "left",
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: center ? "center" : "flex-start",
      cursor: sortable ? "pointer" : "default",
      transition: "color 0.15s",
    }}
    onMouseEnter={e => { if (sortable) (e.currentTarget as HTMLElement).style.color = "#f9a8d4"; }}
    onMouseLeave={e => { if (sortable) (e.currentTarget as HTMLElement).style.color = sortDir ? "#fca5a5" : "#d1d5db"; }}
  >
    {children}
    {sortable && <SortIcon dir={sortDir ?? null} />}
  </div>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  rows: JalonsRow[];
  personnes: PersonneApi[];
  updateField: <K extends keyof JalonsRow>(id: string, field: K, value: JalonsRow[K]) => void;
  saveRow: (id: string) => void;
  toggleImmediate: (id: string, field: "planning" | "livrable", value: boolean) => void;
  saveComment: (id: string, text: string) => void;
  requestDelete: (id: string) => void;
}

const COL = "52px 1fr 60px 220px 128px 128px 66px 168px 76px";

// ── Sort helpers ──────────────────────────────────────────────────────────────

const compareRows = (a: JalonsRow, b: JalonsRow, field: SortField, dir: SortDir): number => {
  let va: number | string | null = null;
  let vb: number | string | null = null;

  switch (field) {
    case "name":
      va = a.name.toLowerCase();
      vb = b.name.toLowerCase();
      break;
    case "datePrevue":
      va = a.datePrevue?.getTime() ?? -Infinity;
      vb = b.datePrevue?.getTime() ?? -Infinity;
      break;
    case "dateActualisee":
      va = a.dateActualisee?.getTime() ?? -Infinity;
      vb = b.dateActualisee?.getTime() ?? -Infinity;
      break;
    case "delta":
      va = a.delta ?? -Infinity;
      vb = b.delta ?? -Infinity;
      break;
    case "statut":
      va = isRowRealise(a) ? 1 : 0;
      vb = isRowRealise(b) ? 1 : 0;
      break;
  }

  if (va === null || va === vb) return 0;
  const cmp = va < vb ? -1 : 1;
  return dir === "asc" ? cmp : -cmp;
};

// ── Main ──────────────────────────────────────────────────────────────────────

export const PlanningTable: React.FC<Props> = ({
  rows,
  personnes,
  updateField,
  saveRow,
  toggleImmediate,
  saveComment,
  requestDelete,
}) => {
  const [externalMode, setExternalMode] = React.useState<Record<string, boolean>>({});
  const [commentRow, setCommentRow] = React.useState<string | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<SortState>({ field: null, dir: "asc" });
  const [hideRealise, setHideRealise] = React.useState(false);

  const toggleSort = (field: SortField) =>
    setSort(prev =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );

  const visibleRows = React.useMemo(() => {
    const filtered = hideRealise ? rows.filter(r => !isRowRealise(r)) : [...rows];
    const result = sort.field ? filtered.sort((a, b) => compareRows(a, b, sort.field!, sort.dir)) : filtered;
    return result;
  }, [rows, hideRealise, sort]);

  const statutCount = rows.filter(r => isRowRealise(r)).length;
  const sortDirFor = (field: SortField): SortDir | null => sort.field === field ? sort.dir : null;
  const commentRowData = commentRow ? rows.find(r => r.id === commentRow) : null;
  const deleteRowData = deleteRow ? rows.find(r => r.id === deleteRow) : null;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: 13, minHeight: 0, overflow: "hidden" }}>

      {/* ── HEADER avec tri + œil ── */}
      <div style={{
        display: "grid", gridTemplateColumns: COL, gap: "0 8px",
        alignItems: "center", backgroundColor: "#1f2937",
        padding: "10px 16px", borderRadius: "10px 10px 0 0", flexShrink: 0,
      }}>
        <Th>Planning</Th>
        <Th sortable sortDir={sortDirFor("name")} onSort={() => toggleSort("name")}>
          Jalons &amp; Livrables
        </Th>
        <Th center>Livrable</Th>
        <Th>Nom du Resp.</Th>
        <Th sortable sortDir={sortDirFor("datePrevue")} onSort={() => toggleSort("datePrevue")}>
          Date prévue
        </Th>
        <Th sortable sortDir={sortDirFor("dateActualisee")} onSort={() => toggleSort("dateActualisee")}>
          Date actualisée
        </Th>
        <Th center sortable sortDir={sortDirFor("delta")} onSort={() => toggleSort("delta")}>
          Delta
        </Th>
        <Th sortable sortDir={sortDirFor("statut")} onSort={() => toggleSort("statut")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Statut
            <span style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999, lineHeight: 1.4 }}>
              {statutCount}/{rows.length}
            </span>
          </span>
        </Th>
        {/* Œil dans la dernière colonne header */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setHideRealise(v => !v)}
            title={hideRealise ? "Afficher les lignes réalisées" : "Masquer les lignes réalisées"}
            style={{
              width: 28, height: 28, border: "none", borderRadius: 6, cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: hideRealise ? "#dc2626" : "transparent",
              color: hideRealise ? "#fff" : "#6b7280",
              transition: "background-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { if (!hideRealise) { e.currentTarget.style.backgroundColor = "#374151"; e.currentTarget.style.color = "#d1d5db"; } }}
            onMouseLeave={e => { if (!hideRealise) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; } }}
          >
            {hideRealise ? (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── ROWS (scrollable) ── */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        border: "1px solid #e5e7eb", borderTop: "none",
        borderRadius: "0 0 10px 10px", backgroundColor: "#fff", minHeight: 0,
      }}>
        {visibleRows.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: 13 }}>
            {rows.length === 0 ? "Aucune donnée" : "Aucune ligne ne correspond aux filtres"}
          </div>
        )}

        {visibleRows.map((row, idx) => {
          const isExternal = externalMode[row.id] ?? !row.isRespInterne;
          const nameDisabled = isDemande(row.name);
          const realise = isRowRealise(row);

          return (
            <div
              key={row.id}
              style={{
                display: "grid", gridTemplateColumns: COL, gap: "0 8px",
                alignItems: "center", padding: "8px 16px",
                backgroundColor: row.isDirty ? "#fff7f7" : realise ? "#f0fdf4" : idx % 2 === 0 ? "#fff" : "#f9fafb",
                borderBottom: "1px solid #f3f4f6",
                borderLeft: row.isDirty ? "3px solid #dc2626" : realise ? "3px solid #16a34a" : "3px solid transparent",
                transition: "background-color 0.15s",
                opacity: realise && hideRealise ? 0 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fef2f2")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = row.isDirty ? "#fff7f7" : realise ? "#f0fdf4" : idx % 2 === 0 ? "#fff" : "#f9fafb")}
            >
              {/* Planning */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Toggle checked={row.planning ?? false} onChange={v => toggleImmediate(row.id, "planning", v)} />
              </div>

              {/* Nom */}
              <div>
                <input
                  style={{
                    width: "100%", border: "1px solid #e5e7eb", borderRadius: 8,
                    padding: "5px 10px", fontSize: 13,
                    color: nameDisabled ? "#9ca3af" : "#1f2937",
                    backgroundColor: nameDisabled ? "#f9fafb" : "#fff",
                    cursor: nameDisabled ? "not-allowed" : "text",
                    outline: "none", boxSizing: "border-box",
                  }}
                  value={row.name}
                  disabled={nameDisabled}
                  onChange={e => updateField(row.id, "name", e.target.value)}
                  onBlur={() => saveRow(row.id)}
                />
              </div>

              {/* Livrable */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Toggle checked={row.livrable ?? false} onChange={v => toggleImmediate(row.id, "livrable", v)} colorOn="#ef4444" />
              </div>

              {/* Responsable */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {isExternal ? (
                  <input
                    style={{ flex: 1, minWidth: 0, border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    placeholder="Externe…"
                    value={row.demandeEquipier ?? ""}
                    onChange={e => updateField(row.id, "demandeEquipier", e.target.value)}
                    onBlur={() => saveRow(row.id)}
                  />
                ) : (
                  <PersonneCombobox
                    value={row.demandeEquipier ?? ""}
                    personnes={personnes}
                    onChange={nom => updateField(row.id, "demandeEquipier", nom)}
                    onBlur={() => saveRow(row.id)}
                  />
                )}
                <button
                  title={isExternal ? "Passer en interne" : "Saisir un externe"}
                  onClick={() => setExternalMode(p => ({ ...p, [row.id]: !p[row.id] }))}
                  style={{ flexShrink: 0, width: 28, height: 28, border: "none", borderRadius: "50%", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", transition: "background-color 0.15s, color 0.15s", padding: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </button>
              </div>

              {/* Date prévue */}
              <div>
                <input type="date"
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 8px", fontSize: 12, outline: "none", boxSizing: "border-box", color: "#374151" }}
                  value={formatDate(row.datePrevue)}
                  onChange={e => updateField(row.id, "datePrevue", parseDate(e.target.value))}
                  onBlur={() => saveRow(row.id)}
                />
              </div>

              {/* Date actualisée */}
              <div>
                <input type="date"
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 8px", fontSize: 12, outline: "none", boxSizing: "border-box", color: "#374151" }}
                  value={formatDate(row.dateActualisee)}
                  onChange={e => updateField(row.id, "dateActualisee", parseDate(e.target.value))}
                  onBlur={() => saveRow(row.id)}
                />
              </div>

              {/* Delta */}
              <div style={{ textAlign: "center" }}>
                <DeltaBadge delta={row.delta} />
              </div>

              {/* Statut */}
              <div>
                {row.livrable ? (
                  <select
                    style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 8px", fontSize: 13, outline: "none", backgroundColor: "#fff", color: "#374151", boxSizing: "border-box" }}
                    value={row.statutLibelle}
                    onChange={e => { updateField(row.id, "statutLibelle", e.target.value); saveRow(row.id); }}
                  >
                    <option>En attente</option>
                    <option>En cours</option>
                    <option>Réalisé</option>
                  </select>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Toggle
                      checked={row.statut}
                      onChange={v => { updateField(row.id, "statut", v); saveRow(row.id); }}
                      colorOn="#16a34a"
                    />
                    <span style={{ fontSize: 12, fontWeight: 500, color: row.statut ? "#16a34a" : "#6b7280" }}>
                      {row.statut ? "Réalisé" : "A faire"}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <button
                  title={row.commentaire ? "Voir / modifier le commentaire" : "Ajouter un commentaire"}
                  onClick={() => setCommentRow(row.id)}
                  style={{ width: 28, height: 28, border: "none", borderRadius: "50%", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: row.commentaire ? "#dc2626" : "#9ca3af", transition: "background-color 0.15s", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <svg width="15" height="15" fill={row.commentaire ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </button>
                <button
                  title="Supprimer cette ligne"
                  onClick={() => setDeleteRow(row.id)}
                  style={{ width: 28, height: 28, border: "none", borderRadius: "50%", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", transition: "background-color 0.15s, color 0.15s", padding: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODALS ── */}
      {commentRow && commentRowData && (
        <CommentModal
          row={commentRowData}
          onSave={text => { saveComment(commentRow, text); setCommentRow(null); }}
          onClose={() => setCommentRow(null)}
        />
      )}
      {deleteRow && deleteRowData && (
        <DeleteModal
          rowName={deleteRowData.name}
          onConfirm={() => { requestDelete(deleteRow); setDeleteRow(null); }}
          onClose={() => setDeleteRow(null)}
        />
      )}
    </div>
  );
};
