import { Link } from "react-router-dom"
import AllStats from "../components/StatsFeature/AllStats"
import CoursesPlayed from "../components/CourseFeatrues/CoursesPlayed"
import meeseekb from "../assets/images/meeseeks/meeseekb.PNG";
import "../styles/Stats.css"

export default function Dashboard({user}) {
	return(
		<>
			<h1>{(user?.username).toUpperCase()}'S STATS</h1>
			<img src={meeseekb} width="70%" />

			<AllStats />

			<CoursesPlayed />
		</>
		
	)
}