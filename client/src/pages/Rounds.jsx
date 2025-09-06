import {useState } from "react"
import { Link } from "react-router-dom";
import RoundGallery from "../components/RoundFeatures/RoundGallery"

export default function Rounds(){

	return(
		<div className="round_gallery">
			<h1>My Rounds</h1>
			<Link to={`/rounds/new`}>
				<button>Add Round</button>
			</Link>	
			
			<RoundGallery />
		</div>
	)
}