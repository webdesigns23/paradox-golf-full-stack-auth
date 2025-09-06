import { useContext} from "react"
import { RoundContext } from "../../context/RoundContext";
import RoundCard from "./RoundCard";
import "../../styles/Round.css"


export default function RoundGallery() {
	const { rounds, loading, error, deleteRound, updateRound } = useContext(RoundContext);

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>

	return (
		<div className="gallery">
			{rounds.map(round => (
				<div key={round.id} className="gallery-item">
					<RoundCard
						round={round}
						handleDelete={() => deleteRound(round.id)}
						handleUpdate={(updates) => updateRound(round.id, updates)}
					/>
				</div>
			))}
		</div>
	)
}