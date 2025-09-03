import { useState, useContext } from "react";
import {RoundContext} from "../../../context/RoundContext";
import RoundFields from "./RoundFields";
import HoleFields from "./HoleFields";
import ShotFields from "./ShotFields";

export default function NewRoundForm(){
	const { rounds, setRounds } = useContext(RoundContext);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

  const [roundData, setRoundData] = useState({
		course_name: "",
		course_external_id: 1234,
		date: new Date().toISOString().split("T")[0],
		tee: "",
		tee_name: "",
		holes: "",
		notes: "",
	})

  const [holeData, setHoleData] = useState({
		hole_number: 1,
		par: 3,
		score: 1,
	})

	const [shotData, setShotData] = useState({
		stroke_number: 1,
		start_distance: "",
		unit: "yd",
		surface: "tee",
		penalty: 0,
		club: "",
		notes: "",
	})

	
  //update Round, Hole, Shot
	function updateRound(e) {
		const { name, value } = e.target;
    const numericFields = ["holes", "course_external_id"];
		setRoundData((prev) => ({ ...prev, 
      [name]: numericFields.includes(name) && value !== "" ? Number(value) : value }));
	}

  function updateHole(e) {
		const {name, value} = e.target;
    const numericFields = ["hole_number", "par", "score"].includes(name);
		setHoleData((prev) => ({ ...prev, 
      [name]: numericFields && value !== "" ? Number(value) : value }));
	}

  function updateShot(e) {
    const { name, value } = e.target;
    const numericFields = ["stroke_number", "start_distance", "penalty"].includes(name);
    setShotData(prev => ({
      ...prev,
      [name]: numericFields ? (value === "" ? "" : Number(value)): value }));
  }


	//reuseability for submit POST fetch
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

      //Create one Shots for that Hole
      const sRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes/${createdHole.id}/shots`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(shotData),
        });
        if (!sRes.ok) throw new Error(`Create shot failed: ${sRes.status}`);
        await sRes.json();

      // Update context 
      setRounds([...rounds, createdRound]);

      //Reset forms
      setRoundData({
        course_name: "",
        course_external_id: "",
        date: "",
        tee: "",
        tee_name: "",
        holes: "",
        notes: "",
      });
      setHoleData({ hole_number: 1, par: 3, score: 1 });
      setShotData([{ stroke_number: 1, start_distance: "", unit: "yd", surface: "tee", penalty: 0, club: "", notes: "" }]);

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

			<RoundFields roundData={roundData} updateRound={updateRound}/>
			<HoleFields holeData={holeData} updateHole={updateHole}/>
			<ShotFields shotData={shotData} updateShot={updateShot}/>

			<button type="submit" disabled={submitting} className="submitBtn">
				{submitting ? "Saving..." : "Save"}
			</button>
		</form>
	)
}

