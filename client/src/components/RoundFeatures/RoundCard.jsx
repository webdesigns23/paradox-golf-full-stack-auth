import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Round.css"


export default function RoundCard({ round, handleDelete, handleUpdate }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(round.notes || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  async function onSave() {
    setErr(null);
    if (notes.length > 100) {
      setErr("Notes cannot be more than 100 characters");
      return;
    }

    try {
      setSaving(true);
      await handleUpdate({ notes });
      setEditing(false);
    } catch (e) {
      setErr(e?.message || "Failed to update notes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="round-card">
      <h2>Course: {round.course_name}</h2>
      <h3>{round.date}</h3>
      <p>Tee: {round.tee} {round.tee_name ? `- ${round.tee_name}` : ""}</p>
      <p>Holes: {round.holes}</p>

      {!editing ? (
        <p>
          Notes: {round.notes}
          <button
            className="update_button"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setEditing(true)}
          >
            Edit Notes
          </button>
        </p>
      ) : (
        <div>
          {err && <div className="error">{err}</div>}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={100}
            rows={3}
          />
          <div className="actions">
            <button onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
            <button onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="actions">
        <Link to={`/rounds/${round.id}`}>
          <button>Round Details</button>
        </Link>
        <button className="remove_button" onClick={handleDelete}>
          x
        </button>
      </div>
    </div>
  );
}