import ShotFields from "./ShotFields"

export default function ShotList(
	{shots=[], holeIndex, updateShot, addShotRow, removeShotRow}
) {
	return(
		<div className="form_section">
			<h3>Shots</h3>

			{shots.map((shot, shotIndex) => (
				<ShotFields
				key={shotIndex}
				holeIndex={holeIndex}
				shotIndex={shotIndex}
				shot={shot}
				updateShot={updateShot}
				onRemove={() => removeShotRow(holeIndex, shotIndex)} 
				/>
			))}
			
			<button className="form_button" type="button" onClick={() => addShotRow(holeIndex)}>
				Add Shot
			</button>	
		</div>
	)
}