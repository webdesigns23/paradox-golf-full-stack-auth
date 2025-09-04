import ShotFields from "./ShotFields"

export default function ShotList(
	{shots=[], holeIndex, updateShot, addShotRow, removeShotRow}
) {
	return(
		<div className="form_section">			

			{shots.map((shot, shotIndex) => (
				<div key={shotIndex}> 
					<div> 
						<button className="remove_button" type="button" onClick={() => removeShotRow(holeIndex, shotIndex)}>
							Remove Shot
						</button>
						<h3 className="h3">Shot {shot.stroke_number}</h3>
					</div>
						<ShotFields						
						holeIndex={holeIndex}
						shotIndex={shotIndex}
						shot={shot}
						updateShot={updateShot}
						onRemove={() => removeShotRow(holeIndex, shotIndex)} 
						/>						
				</div>
			))}

			<button className="add_button" type="button" onClick={() => addShotRow(holeIndex)}>
				Add Shot
			</button>	
		</div>
	)
}