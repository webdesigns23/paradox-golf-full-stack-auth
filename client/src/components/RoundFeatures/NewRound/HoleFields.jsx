

export default function HoleFields({hole, holeIndex, updateHole}){

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
            value={hole.hole_number}
            onChange={(e) => updateHole(holeIndex, "hole_number", e.target.value)}
          />
        </label>

        <label className="inlineLabel">
          Hole Par
		  <input className="input"
            type="number"
            name="par"
            min={3}
            max={5}
            value={hole.par}
            onChange={(e) => updateHole(holeIndex, "par", e.target.value)} 
          />
        </label>
		
        <label className="inlineLabel">
          Your Score
		  <input className="input"
            type="number"
            name="score"
            min={1}
            value={hole.score}
            onChange={(e) => updateHole(holeIndex, "score", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}