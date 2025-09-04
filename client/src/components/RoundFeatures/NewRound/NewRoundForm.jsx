import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoundContext } from "../../../context/RoundContext";
import RoundFields from "./RoundFields";
import HoleList from "./HoleList";

export default function NewRoundForm(){
	const { setRounds } = useContext(RoundContext);
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

  const navigate = useNavigate();

  //Array of holes, will now have a shots array per hole
  const [holesData, setHolesData] = useState([])

  //auto make rows base on selection
  function generateHoles(selection) {
    if (selection === "front9") {
      return Array.from({ length: 9 }, (_,i) => ({
        hole_number: i + 1,
        par: 3,
        score: 1
      }));
    }
    if (selection === "back9") {
      return Array.from({ length: 9 }, (_,i) => ({
        hole_number: 10 + i,
        par: 3,
        score: 1
      }));
    }
    if (selection === "18") {
      return Array.from({ length: 18 }, (_,i) => ({
        hole_number: i + 1,
        par: 3,
        score: 1
      }));
    }
    return [];
  }
  
  function handleGenerateHoles() {
    if (!roundData.holes) return;
    setHolesData(generateHoles(roundData.holes));
  }

  function handleClearHoles() {
    setHolesData([]);
  }

	
  //update Round
	function updateRound(e) {
		const { name, value } = e.target;
    const numericFields = ["course_external_id"];
		setRoundData((prev) => ({ ...prev, 
      [name]: numericFields.includes(name) && value !== "" ? Number(value) : value }));
	}

  //update Hole
  function updateHole(holeIndex, name, initialValue) {
    const numericFields = ["hole_number", "par", "score"];

		const value = numericFields.includes(name) && initialValue !== "" ? Number(initialValue) : initialValue;
    
		setHolesData((prev) => prev.map((h, i) => (i === holeIndex ? { ...h, [name]: value} : h))
   );
	}

  const startNum = roundData.holes === "front9" ? 1 : 10;

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
      }

      //Update context and sort
      setRounds(prev => {
        const next = [createdRound, ...prev];
        next.sort((a,b) => new Date(b.date) - new Date(a.date));
        return next;
      })  

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

      navigate("/rounds");
    
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }
  
	return(
		<form onSubmit={handleSubmit} className="form">
			{error && <div className="error"> Error: {error}</div>}

			<RoundFields roundData={roundData} updateRound={updateRound}/>

      {/*Generate holes or clear*/}
      <div className="form_selection">
        <button type="button" className="add_button" 
        onClick={handleGenerateHoles} 
        disabled={!roundData.holes} 
        title={roundData.holes ? "" : "Select Front 9 /Back 9/ or 18 Holes first!"}>
        Add Scores
        </button>
        {holesData.length > 0 && (
          <button type="button"
          className="remove_button"
          onClick={handleClearHoles}>
            Clear Holes
          </button>
        )}
      </div>
      {holesData.length > 0 && (
			<HoleList
        holes={holesData} 
        updateHole={updateHole}
      />        
      )}
      
			<button type="submit" disabled={submitting} className="submit_button">
				{submitting ? "Saving..." : "Save"}
			</button>
		</form>
	)
}

