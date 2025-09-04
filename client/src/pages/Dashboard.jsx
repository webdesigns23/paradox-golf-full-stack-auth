import { Link } from "react-router-dom"
import AllStats from "../components/StatsFeature/AllStats"

export default function Dashboard() {
	return(
		<>
			<h1>Dashboard Page</h1>
			<Link to={`/rounds/new`}>
				<button>Add Round</button>
			</Link>	
			
			<Link to={`/courses`}>
				<button>Search Courses</button>
			</Link>

			<AllStats />
			
		
		</>
		
	)
}