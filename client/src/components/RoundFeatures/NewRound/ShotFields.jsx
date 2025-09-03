

export default function ShotFields({shotData, updateShot}) {

	return (
		<div className="form_section">
			<h3 className="h3">Shots</h3>
			<label className="label">
				Stroke #
				<input className="input"
					type="number"
					name="stroke_number"
					value={shotData.stroke_number}
					onChange={updateShot}
				/>
			</label>

			<label className="label">
				Start Distance
				<input className="input"
					type="number"
					name="start_distance"
					value={shotData.start_distance}
					onChange={updateShot}
					placeholder="distance to hole"
				/>
			</label>

			<label className="label">
				Unit
				<select className="input"
					name="unit"
					value={shotData.unit}
					onChange={updateShot}
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
					value={shotData.surface}
					onChange={updateShot}
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
					value={shotData.penalty}
					onChange={updateShot}
				/>
			</label>

			<label className="label">
				Club
				<input className="input"
					name="club"
					value={shotData.club || ""}
					onChange={updateShot}
					placeholder="what club did you use?"
				/>
			</label>

			<label className="label">
				Notes
				<textarea className="textarea"
					type="text"
					name="notes"
					value={shotData.notes}
					onChange={updateShot}
					placeholder="how was your shot?"
				/>
			</label>
		</div>
	);
}