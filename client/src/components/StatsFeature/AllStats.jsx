import RoundStats from "./RoundStats"
import ScoreStats from "./ScoreStats"

export default function AllStats() {
	return(
		<>
			<h2>Round Stats</h2>
			<RoundStats />
			<h2>Score Stats</h2>
			<ScoreStats />
		</>
	)
}