import ShotFields from "./ShotFields"

export default function AddShotRows({shots=[], updateShot, onAdd, onRemove}) {
	return(
		<div className="form_section"> 

			{shots.map((shot, i) => (
				<ShotFields key={i}
				index={i}
				shot={shot}
				updateShot={updateShot}
				onRemove={onRemove}/>
			))}
			<button type="add_button" onClick={onAdd}>Add Shot</button>
		</div>
	)
}