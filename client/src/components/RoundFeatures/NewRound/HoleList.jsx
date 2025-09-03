import HoleFields from "./HoleFields"
import ShotList from "./ShotList"

export default function HoleList(
	{holes, updateHole, addHoleRow, removeHoleRow, 
	updateShot, addShotRow, removeShotRow}
	) {
		
	return(
		<div className="form_section">
			<h2>Holes</h2>

			{holes.map((hole, holeIndex) => (
				<div key={holeIndex}>
					<div>
						<h3>Hole {hole.hole_number}</h3>
						<button type="button" onClick={() => removeHoleRow(holeIndex)}>
							Remove Hole
						</button>
					</div>
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
			<button type="button" onClick={addHoleRow}>Add Hole</button>			
		</div>
	)
}