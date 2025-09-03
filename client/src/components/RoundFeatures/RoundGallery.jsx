import { useContext} from "react"
import { RoundContext } from "../../context/RoundContext";
import RoundCard from "./RoundCard";


export default function RoundGallery(){
	const {rounds, loading, error} = useContext(RoundContext);

	

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>


	return(
		<>
			{rounds.map(round =>(
				<div key={round.id}
				className="gallery-item">
					<RoundCard round={round} handleDelete={deleteRound}/>
				</div>
			))}
		</>
	)
}