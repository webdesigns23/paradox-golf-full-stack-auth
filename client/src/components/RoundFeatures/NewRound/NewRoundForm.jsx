import { useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
import {RoundContext} from "../../../context/RoundContext";
import RoundFields from "./RoundFields";
import HoleList from "./HoleList";

export default function NewRoundForm(){
	const { rounds, setRounds } = useContext(RoundContext);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

  const [showAddHole, setShowAddHole] = useState(false);

  const [roundData, setRoundData] = useState({
		course_name: "",
		course_external_id: 1234,
		date: new Date().toISOString().split("T")[0],
		tee: "",
		tee_name: "",
		holes: "",
		notes: "",
	})

  const navigate = useNavigate();

  //Array of holes, will now have a shots array per hole
  const [holesData, setHolesData] = useState([])

	
  //update Round, Hole, Shot
	function updateRound(e) {
		const { name, value } = e.target;
    const numericFields = ["holes", "course_external_id"];
		setRoundData((prev) => ({ ...prev, 
      [name]: numericFields.includes(name) && value !== "" ? Number(value) : value }));
	}

  function updateHole(holeIndex, name, initialValue) {
    const numericFields = ["hole_number", "par", "score"];

		const value = numericFields.includes(name) && initialValue !== "" ? Number(initialValue) : initialValue;
    
		setHolesData((prev) => prev.map((h, i) => (i === holeIndex ? { ...h, [name]: value} : h))
   );
	}

  function updateShot(holeIndex, shotIndex, name, initialValue) {
    const numeric = ["stroke_number", "start_distance", "penalty"].includes(name);
    const value = numeric ? (initialValue === "" ? "" : Number(initialValue)) : initialValue;
    
    setHolesData((prev) =>
      prev.map((h, i) => {
        if (i !== holeIndex) return h;
        return {
          ...h,
          shots: h.shots.map((s, _) => (_ === shotIndex ? { ...s, [name]: value} : s)),
        };
      })
    );
  }

  //add remove holes fields
  function addHoleRow() {
    setHolesData((prev) => [
      ...prev,
      {
        hole_number: prev.length + 1,
        par: 3,
        score: 1,
        shots: []
      }
      
    ]);
  }

  function removeHoleRow(holeIndex) {
    setHolesData((prev) => {
      const nextHole = prev.filter((_, i) => i !== holeIndex);
      return nextHole.map((h, i) => ({ ...h, hole_number: i +1}));
    });
  }

  //add remove shots fields
  function addShotRow(holeIndex) {
    setHolesData((prev) => 
      prev.map((h,i) => {
        if (i !== holeIndex) return h;
        const nextStroke = (h.shots?.length || 0 ) +1;
        return {
          ...h,
          shots:[
            ...h.shots,
            {
              stroke_number: nextStroke, 
              start_distance: "", 
              unit: "yd", 
              surface: "fairway", 
              penalty: 0, 
              club: "", 
              notes: ""   
            },
          ]
        }
    })
  )}

  function removeShotRow(holeIndex, shotIndex) {
    setHolesData((prev) =>
      prev.map((h, i) => {
        if(i !== holeIndex) return h;
        const trimmed = h.shots.filter((_,s) => s !== shotIndex);

        const renumber = trimmed.map((s, index) => ({ ...s, stroke_number: index +1}));
        return { ...h, shots: renumber};
      })
    )
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

      //Create Holes for that Round
      for (const hole of holesData) {
        const hRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          hole_number: hole.hole_number,
          par: hole.par,
          score: hole.score,
        }),
      });
      if (!hRes.ok) throw new Error(`Create hole failed: ${hRes.status}`);
      const createdHole = await hRes.json();

      //Create Shots for that Hole
      for (const shot of hole.shots) {
        const sRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes/${createdHole.id}/shots`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            stroke_number: shot.stroke_number,
            start_distance: shot.start_distance === "" ? null : shot.start_distance,
            unit: shot.unit,
            surface: shot.surface,
            penalty: shot.penalty || 0,
            club: shot.club || "",
            notes: shot.notes || "",
          }),
        });
        if (!sRes.ok) throw new Error(`Create shot failed: ${sRes.status}`);
        await sRes.json();
        }
      }
         
      // Update context and sort
      
      setRounds(prev => {
        const next = [createdRound, ...prev];
        next.sort((a,b) => new Date(b.date) - new Date(a.date));
        return next;
      })

      navigate("/rounds");

      //Reset forms
      setRoundData({
        course_name: "",
        course_external_id: 1234,
        date: new Date().toISOString().split("T")[0],
        tee: "",
        tee_name: "",
        holes: "",
        notes: "",
      });
      setHolesData([]);

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

			<HoleList
        holes={holesData} 
        updateHole={updateHole}
        updateShot={updateShot}
        addHoleRow={addHoleRow}
        removeHoleRow={removeHoleRow}
        addShotRow={addShotRow}
        removeShotRow={removeShotRow}
      />
	
			<button type="submit" disabled={submitting} className="submit_button">
				{submitting ? "Saving..." : "Save"}
			</button>
		</form>
	)
}

