import RoundStats from "./RoundStats"
import ScoreStats from "./ScoreStats"
import "../../styles/Stats.css"

export default function AllStats() {
	return(
		<>
		<section className="stats_section">
			<h2>Round Stats</h2>
			<RoundStats />
			<h2>Score Stats</h2>
			<ScoreStats />
		</section>
		</>
	)
}