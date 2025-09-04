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

	//rounds per wk
	let roundsPerWeek = 0;
	if (sorted.length >1) {
		const msPerWeek = 1000 * 60 * 60 * 24 * 7;
		const spanWeeks = Math.max(1, (new Date(sorted[sorted.length - 1].date) - new Date(sorted[0].date)) / msPerWeek);
  		const roundsPerWeek = (roundsPlayed / spanWeeks).toFixed(2);
	}
	
	return(
		<div>
			<p>Rounds Played: {roundsPlayed}</p>
			<p>Last Played: {lastPlayed}</p>
			<p>Rounds played per Week: {roundsPerWeek}</p>
		</div>
	)
}