

export default function ShotFields({index, shot, updateShot, onRemove }) {

	return (
		<div className="form_section">
			<label className="label">
				Stroke #
				<input className="input"
					type="number"
					name="stroke_number"
					value={shot.stroke_number}
					onChange={(e) => updateShot(index, "stroke_number", e.target.value)}
				/>
			</label>

			<label className="label">
				Start Distance
				<input className="input"
					type="number"
					name="start_distance"
					value={shot.start_distance}
					onChange={(e) => updateShot(index, "start_distance", e.target.value)}
					placeholder="distance to hole"
				/>
			</label>

			<label className="label">
				Unit
				<select className="input"
					name="unit"
					value={shot.unit}
					onChange={(e) => updateShot(index, "unit", e.target.value)}
				>
					<option value="yd">yd</option>
					<option value="m">m</option>
					<option value="ft">ft</option>
				</select>
			</label>

			<label className="label">
				Surface
				<select className="input"
					name="surface"
					value={shot.surface}
					onChange={(e) => updateShot(index, "surface", e.target.value)}
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
					name="penalty"
					value={shot.penalty}
					onChange={(e) => updateShot(index, "penalty", e.target.value)}
				/>
			</label>

			<label className="label">
				Club
				<input className="input"
					name="club"
					value={shot.club || ""}
					onChange={(e) => updateShot(index, "club", e.target.value)}
					placeholder="what club did you use?"
				/>
			</label>

			<label className="label">
				Notes
				<textarea className="textarea"
					type="text"
					name="notes"
					value={shot.notes}
					onChange={(e) => updateShot(index, "notes", e.target.value)}
					placeholder="how was your shot?"
				/>
			</label>
			 <button type="button" onClick={() => onRemove(index)}>Remove</button>
		</div>
	);
}