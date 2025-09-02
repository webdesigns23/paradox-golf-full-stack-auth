

export default function RoundCard({round}){
	

	return(
		<div className="round-card">
			<p>{round.date}</p>
			<h2>Course: {round.course_name}</h2>
			<h2>Tee Box: {round.tee}</h2>
			<h2>{round.tee_name} Tees</h2>	
			<p>{round.holes}</p>
			<p>Notes: {round.notes}</p>		
		</div>
	)
}