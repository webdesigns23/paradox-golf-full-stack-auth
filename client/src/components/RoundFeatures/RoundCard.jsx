import { Link } from "react-router-dom";

export default function RoundCard({round}){
	

	return(
		<div className="round-card">
			<h2>Course: {round.course_name}</h2>
			<h3>{round.date}</h3>
			<p>Tee: {round.tee} - {round.tee_name} </p>
			<p>Holes: {round.holes}</p>
			<p>Notes: {round.notes}</p>	

			<Link to={`/rounds/${round.id}`}>
				<button>Round Details</button>
			</Link>	
			
		</div>
	)
}