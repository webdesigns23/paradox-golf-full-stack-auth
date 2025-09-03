import { useState, useContext } from "react";
import {RoundContext} from "../../../context/RoundContext";
import RoundFields from "./RoundFields";
import HoleFields from "./HoleFields";
import ShotFields from "./ShotFields";

export default function NewRoundForm(){
	const { rounds, setRounds } = useContext(RoundContext);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	//reuseability for fetch
	const token = localStorage.getItem("token");
	const authHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	//handle form submit
	async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);


    try {
      //Create Round
      const rRes = await fetch(`http://127.0.0.1:5555/rounds`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(roundData),
      });
      if (!rRes.ok) throw new Error(`Create round failed: ${rRes.status}`);
      const createdRound = await rRes.json();

      //Create one Hole for that Round
      const hRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(holeData),
      });
      if (!hRes.ok) throw new Error(`Create hole failed: ${hRes.status}`);
      const createdHole = await hRes.json();

      //Create Shots for that Hole
      for (const shot of shots) {
        const sRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes/${createdHole.id}/shots`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(shot),
        });
        if (!sRes.ok) throw new Error(`Create shot failed: ${sRes.status}`);
        await sRes.json();
      }

      // Update context 
      setRounds([...rounds, createdRound]);

      //Reset forms
      setRoundData({
        course_name: "",
        course_external_id: "",
        date: "",
        tee: "",
        tee_name: "",
        holes: 18,
        notes: "",
      });
      setHoleData({ hole_number: 1, par: 4, score: 4 });
      setShots([{ stroke_number: 1, start_distance: 250, unit: "yd", surface: "tee", penalty: 0, club: "Driver", notes: "" }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

	return(
		<form onSubmit={handleSubmit} className="form">
			<h2>Add New Round</h2>
			{error && <div className="error"> Error: {error}</div>}

			<RoundFields />
			<HoleFields />
			<ShotFields />

			<button type="submit" disabled={submitting} className="submitBtn">
				{submitting ? "Saving..." : "Save"}
			</button>
		</form>
	)
}

