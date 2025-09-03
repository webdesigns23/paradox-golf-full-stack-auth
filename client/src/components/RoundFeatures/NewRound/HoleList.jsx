import HoleFields from "./HoleFields"

export default function HoleList({
	holes, 
	updateHole, 
	updateShot, 
	addHoleRow,   
	removeHoleRow, 
	addShotRow, 
	removeShotRow
	}) {
		
	return(
		<div>
			<h3>Holes</h3>
			<HoleFields />
		</div>
	)
}