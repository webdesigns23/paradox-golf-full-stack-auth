import { useContext, useEffect, useState } from "react";
import { RoundContext } from "../../context/RoundContext";

export default function ScoreStats() {
	const { rounds, loading: roundsLoading, error: roundsError } = useContext(RoundContext);

	const [stats, setStats] = useState({
		birdieOrBetter: 0,
		pars: 0,
		bogeys: 0,
		doublesBogeys: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function runStats() {
			const token = localStorage.getItem("token");
			
			if (!token) {
				setStats({ birdieOrBetter: 0, pars: 0, bogeys: 0, doublesBogeys: 0, totalStrokes: 0 });
				setLoading(false)
				return;
			}

			if (!Array. isArray(rounds) || rounds.length === 0) {
				setStats({ birdieOrBetter: 0, pars: 0, bogeys: 0, doublesBogeys: 0, totalStrokes: 0 });
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				setError(null);
	
				const headers = {
					"Content-Type": "application/json",
					Accept: "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {})
				};

				let totals = { birdieOrBetter: 0, pars: 0, bogeys: 0, doublesBogeys: 0, totalStrokes: 0 };

				for (const r of rounds) {
					const res = await fetch(`http://127.0.0.1:5555/rounds/${r.id}/holes`, { headers });
					if (!res.ok) throw new Error(`HTTP ${res.status}`);
					const holes = await res.json();

					holes.forEach(h => {
						const par = Number(h.par ?? 0);
						const score = Number(h.score ?? 0);
						if (!par || !score) return;

						const diff = score - par;
						if (diff <= -1) totals.birdieOrBetter++;
						else if (diff === 0) totals.pars++;
						else if (diff === 1) totals.bogeys++;
						else totals.doublesBogeys++;

						totals.totalStrokes += score;
					});
				}
				setStats(totals);
			} catch (e) {
				setError(e.message || "Failed to load stats");
			} finally {
				setLoading(false);
			}
		}
		runStats();
	}, [rounds]);

	if (roundsLoading || loading) return <div>Loading…</div>;
  	if (roundsError) return <div>{roundsError}</div>;
  	if (error) return <div>{error}</div>;

	return (
		<div className="stats_grid">
			<div className="stat_card is-good">
				<span className="stat_label">Birdie or Better</span>
				<span className="stat_value">{stats.birdieOrBetter}</span>
			</div>
			<div className="stat_card">
				<span className="stat_label">Pars</span>
				<span className="stat_value">{stats.pars}</span>
			</div>
			<div className="stat_card is-warn">
				<span className="stat_label">Bogeys</span>
				<span className="stat_value">{stats.bogeys}</span>
			</div>
			<div className="stat_card is-bad">
				<span className="stat_label">Double Bogeys+</span>
				<span className="stat_value">{stats.doublesBogeys}</span>
			</div>
		</div>
	);
}