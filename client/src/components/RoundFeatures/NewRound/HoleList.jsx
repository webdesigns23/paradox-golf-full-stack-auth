import HoleFields from "./HoleFields"

export default function HoleList({holes, updateHole, addHoleRow, removeHoleRow}) {
		
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
				</div>
			))}
			<button className="add_button" type="button" onClick={addHoleRow}>Add Hole</button>			
		</div>
	)
}