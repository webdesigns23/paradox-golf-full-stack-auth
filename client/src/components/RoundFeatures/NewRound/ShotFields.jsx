import { useState } from "react";

export default function ShotFields() {
	const [shotData, setShotData] = useState({
		stroke_number: 1,
		start_distance: "",
		unit: "yd",
		surface: "tee",
		penalty: 0,
		club: "",
		notes: "",
	})

	function updateShot(index, field, value) {
		const numeric = ["stroke_number", "start_distance", "penalty"].includes(field);
		setShotData((prev) => prev.map((shot, i) => (i === index ? { ...shot, [field]: numeric ? Number(value) : value } : shot)))
	}

	return (
		<div className="form_section">
			<h3 className="h3">Shots</h3>
			<label className="label">
				Stroke #
				<input className="input"
					type="number"
					value={shotData.stroke_number}
					onChange={(e) => onChange(index, "stroke_number", e.target.value)}
				/>
			</label>

			<label className="label">
				Distance to Hole
				<input className="input"
					type="number"
					value={shotData.start_distance}
					onChange={(e) => onChange(index, "start_distance", e.target.value)}
				/>
			</label>

			<label className="label">
				Unit
				<select className="input"
					value={shotData.unit}
					onChange={(e) => onChange(index, "unit", e.target.value)}
				>
					<option value="yd">yd</option>
					<option value="m">m</option>
					<option value="ft">ft</option>
				</select>
			</label>

			<label className="label">
				Surface
				<select className="input"
					value={shotData.surface}
					onChange={(e) => onChange(index, "surface", e.target.value)}
				>
					<option value="tee">tee</option>
					<option value="fairway">fairway</option>
					<option value="rough">rough</option>
					<option value="sand">sand</option>
					<option value="green">green</option>
				</select>
			</label>

			<label className="label">
				Penalty
				<input className="input"
					type="number"
					value={shotData.penalty}
					onChange={(e) => onChange(index, "penalty", e.target.value)}
				/>
			</label>

			<label className="label">
				Club Used
				<input className="input"
					value={shotData.club || ""}
					onChange={(e) => onChange(index, "club", e.target.value)}
				/>
			</label>

			<label className="label">
				Notes
				<textarea className="textarea"
					type="text"
					name="notes"
					value={shotData.notes}
					onChange={(e) => onChange(index, "notes", e.target.value)}
				/>
			</label>
		</div>
	);
}