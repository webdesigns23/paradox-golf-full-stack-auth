

export default function HoleFields({hole, holeIndex, updateHole}){

	return (
    <>
      <span className="row">
        <div className="inlineLabel">
          <h3 className="h3">Hole {hole.hole_number}</h3>
        </div>
        
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
      </span>
    </>
  );
}