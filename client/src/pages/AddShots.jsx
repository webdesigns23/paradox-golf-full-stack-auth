import {Link} from "react-router-dom"

export default function AddShots(){
	return(
		<>
			<h1>Add Shots</h1>
			<button>
				+ Add Shots
			</button>
			
			<Link to={`/rounds`}>
				<button>No Thanks</button>
			</Link>	
			
		</>
	)
}