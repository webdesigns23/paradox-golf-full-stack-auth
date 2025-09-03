import ShotFields from "./ShotFields"

export default function AddShotRows({shots=[], updateShot, onAdd, onRemove}) {
	return(
		<div className="form_section"> 
			<h3 className="h3">Shots</h3>

			{shots.map((shot, i) => (
				<ShotFields key={i}
				index={i}
				shot={shot}
				updateShot={updateShot}
				onRemove={onRemove}/>
			))}
			<button type="button" onClick={onAdd}>Add Shot</button>
		</div>
	)
}