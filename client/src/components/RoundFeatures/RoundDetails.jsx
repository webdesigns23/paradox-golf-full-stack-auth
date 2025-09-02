import { useParams, Link } from "react-router-dom";
import useRoundHoles from "../../hooks/useRoundHoles"

export default function RoundDetails() {

	const {id} = useParams();
	const {holes, loading, error} = useRoundHoles(id);

	if (loading) return <p>Loading…</p>;
	if (error) return <p>Error: {error}</p>;

	return(
		<>
		<h1>Round Hole Details</h1>

		{holes.length === 0 ? (
			<p>No hole data yet.</p>
		): (
			<div>
				{holes.map((h) => (
					<div key={h.id}>
						<h2>Hole {h.hole_number}</h2>
						<p>Par: {h.par ?? "-"} - Score: {h.par ?? "-"}</p>	

						{h.shots?.length ? (
								<ul style={{ marginTop: ".5rem" }}>
									{h.shots.map((s) => (
										<li key={s.id}>
											#{s.stroke_number} - 
											{s.start_distance ?? "-"} - 
											{s.unit ?? ""} -
											{s.surface ?? ""} -
											{s.penalty ?? ""} - 
											{s.club ?? ""}
											{s.notes ?? ""}
										</li>
									))}
								</ul>
							) : (
								<li>No shots recorded.</li>
							)}			
					</div>
				))}
			</div>
		)}
		</>
	)
}