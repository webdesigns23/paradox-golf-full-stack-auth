import { Link } from "react-router-dom"
import AllStats from "../components/StatsFeature/AllStats"
import CoursesPlayed from "../components/CourseFeatrues/CoursesPlayed"
import course from "../assets/images/course.png";
import round from "../assets/images/new_round.png";
import "../styles/Stats.css"

export default function Dashboard({user}) {
	return(
		<>
			<h1>{(user?.username).toUpperCase()}'S STATS</h1>
			
			
			<Link to={`/rounds/new`}>
			<img src={round} />	
				
			</Link>	
			
			<Link to={`/courses`}>
			<img src={course} />
			
			</Link>

			<AllStats />

			<CoursesPlayed />
		</>
		
	)
}