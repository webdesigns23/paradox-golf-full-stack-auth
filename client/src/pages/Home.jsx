import { Link } from "react-router-dom"
import stats from "../assets/images/view_stats.png";
import round from "../assets/images/new_round.png";
import challenges from "../assets/images/challenges.png"
import "../styles/Stats.css"
import meeseekTips from "../assets/images/meeseeks/meeseek_tips.jpeg"

export default function Home({user}) {
	return(
		<>

			<h1>"hi {user?.username}!"</h1>
			<h2 className="tagline">“I'm Mr. Meeseeks! Look at me!” ...your friendly golf sidekick.</h2>
			<h2>"Want me to help you get 2 strokes off your golf game!"</h2>

			<img src={meeseekTips} width="40%" alt="meeseeks on golf course"/>	
			<br></br>

			<Link to={`/rounds/new`}>
			<img src={round} />	
			</Link>	
			
			<Link to={`/dashboard`}>
			<img src={stats} />
			</Link>

			<Link to={`/challenges`}>
			<img src={challenges} />
			</Link>

		
			
		</>
	);
};