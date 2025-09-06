import "../../../styles/Forms.css"

export default function RoundFields({roundData, updateRound}) {

	return (
		<div className="form_section">
		<h3 className="h3">Course Information</h3>

			<label className="label">
				Course Name
				<input className="input"
					type="text"
					name="course_name"
					value={roundData.course_name}
					onChange={updateRound}
					placeholder="course name"
					required
				/>
			</label>

			<label className="label">
				Date
				<input className="input"
					type="date"
					name="date"
					value={roundData.date}
					onChange={updateRound}
					placeholder="YYYY-MM-DD"
					required
				/>
			</label>
		
			<label className="label">
				Tee
				<br></br>
				<select className="input"
					type="text"
					name="tee"
					value={roundData.tee}
					onChange={updateRound}
					required
				>
					<option value="select">Select Tee...</option>
					<option value="male">Mens Tees</option>
					<option value="female">Ladies Tees</option>
				</select>
			</label>

			<label className="label">
				Tee Name
				<input className="input"
					type="text"
					name="tee_name"
					value={roundData.tee_name}
					onChange={updateRound}
					placeholder="1, 2, 3, white, gold, black, etc."
					required
				/>
			</label>

		
			<label className="label">
				Holes
				<select className="input"
					type="text"
					name="holes"
					value={roundData.holes}
					onChange={updateRound}
					required
				>
					<option value="">Select holes played ...</option>
					<option value="front9">Front 9</option>
					<option value="back9">Back 9</option>
					<option value="18">18 Holes</option>
				</select>
			</label>
		
		<span className="row">	
			<label className="label">
				Notes
				<textarea className="textarea"
					type="text"
					name="notes"
					value={roundData.notes}
					onChange={updateRound}
					placeholder="how was your round?"
				/>
			</label>
		</span>	
		</div>
	);
}