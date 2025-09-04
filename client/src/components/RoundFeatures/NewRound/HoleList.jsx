import HoleFields from "./HoleFields"
import ShotList from "./ShotList"

export default function HoleList(
	{holes, updateHole, addHoleRow, removeHoleRow, 
	updateShot, addShotRow, removeShotRow}
	) {
		
	return(
		<div className="form_section">

			{holes.map((hole, holeIndex) => (
				<div key={holeIndex}>
					<h3 className="h3">Hole {hole.hole_number}</h3>

					<button className="remove_button" type="button" onClick={() => removeHoleRow(holeIndex)}>
						X
					</button>
					
					<HoleFields 
					hole={hole} 
					holeIndex={holeIndex} 
					updateHole={updateHole} 
					/>

					<ShotList 
					shots={hole.shots}
					holeIndex={holeIndex}
					updateShot={updateShot} 
					addShotRow={addShotRow} 
					removeShotRow={removeShotRow}
					/>
				</div>
			))}
			<button className="add_button" type="button" onClick={addHoleRow}>Add Hole</button>			
		</div>
	)
}