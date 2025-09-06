import { useContext } from "react";
import { RoundContext } from "../../context/RoundContext";


export default function RoundStats() {
	const { rounds, loading, error } = useContext(RoundContext);

	if (loading) return <div>Loading…</div>;
 	if (error) return <div>{error}</div>;
  	if (!rounds.length) return <div>No rounds yet</div>;

	//rounds played
	const roundsPlayed = rounds.length;

	//last played
	const sorted = [...rounds].sort((a, b) => new Date(a.date) - new Date(b.date));
	const lastPlayed = sorted[sorted.length - 1]?.date;

	return(
		<div className="stats_grid">

			<div className="stat_card">
			<span className="stat_label">Rounds Played: </span>
			<span className="stat_value">{roundsPlayed}</span>

			</div>

			<div className="stat_card">
			<span className="stat_label">Last Played:</span>
			<span className="stat_value">{lastPlayed}</span>

			</div>

		</div>
	)
}