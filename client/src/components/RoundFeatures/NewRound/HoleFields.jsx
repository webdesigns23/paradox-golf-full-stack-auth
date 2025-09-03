import { useState } from "react";

export default function HoleFields(){
	const [holeData, setHoleData] = useState({
		hole_number: 1,
		par: 3,
		score: 1,
	})

	function updateHole(e) {
		const {name, value} = e.target;
		setHoleData((prev) => ({ ...prev, [name]: ["hole_number", "par", "score"].includes(name) ? Number(value) : value,
    }));
	}

	return (
    <div className="form_section">
      <h3 className="h3">Hole</h3>
      <div className="row">
        <label className="inlineLabel">
          Hole #
		  <input className="input"
            type="number"
            name="hole_number"
            min={1}
            max={18}
            value={holeData.hole_number}
            onChange={updateHole}
          />
        </label>

        <label className="inlineLabel">
          Par
		  <input className="input"
            type="number"
            name="par"
            min={3}
            max={5}
            value={holeData.par}
            onChange={updateHole} 
          />
        </label>
		
        <label className="inlineLabel">
          Score
		  <input className="input"
            type="number"
            name="score"
            min={1}
            value={holeData.score}
            onChange={updateHole}
          />
        </label>
      </div>
    </div>
  );
}