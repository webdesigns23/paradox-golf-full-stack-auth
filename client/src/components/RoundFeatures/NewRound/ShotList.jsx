import ShotFields from "./ShotFields"

export default function ShotList({shots, holeIndex, updateShot, addShotRow, removeShotRow}) {
	return(
		<div>
			<h3>Shots</h3>
			<ShotFields />
		</div>
	)
}