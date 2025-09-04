import HoleFields from "./HoleFields"

export default function HoleList({holes, updateHole}) {
		
	return(
		<div className="form_section">

			{holes.map((hole, holeIndex) => (
				<div key={holeIndex}>
					
					<HoleFields 
					hole={hole} 
					holeIndex={holeIndex} 
					updateHole={updateHole} 
					/>
				</div>
			))}
		
		</div>
	)
}