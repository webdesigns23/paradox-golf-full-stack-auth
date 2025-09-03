import { Link } from "react-router-dom"

export default function Dashboard() {
	return(
		<>
			<h1>Dashboard Page</h1>
			<Link to={`/rounds/new`}>
				<button>Add Round</button>
			</Link>	
		
		</>
		
	)
}