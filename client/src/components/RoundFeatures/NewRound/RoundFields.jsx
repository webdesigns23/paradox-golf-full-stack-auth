
export default function RoundFields(){
	const [roundData, setRoundData] = useState({
		course_name: "",
		course_external_id: "",
		date: "",
		tee: "",
		tee_name: "",
		holes: "",
		notes: "",
	})

	function updateRound(e) {
		const {name, value} = e.target;
		setRoundData((prev) => ({ ...prev, [name]: name === "hole" ? Number(value) : value}));
	}

	return (
    <div className="round_fields">
      <h2 className="h3">Round</h2>

      <label className="label">
        Course Name
        <input className="input"
          name="course_name"
          value={roundData.course_name}
          onChange={updateRound}
          
          required
        />
      </label>

      <label className="label">
        Date
        <input className="input"
          type="date"
          name="date"
          value={roundData.date}
          onChange={updateRound}
          
        />
      </label>

	  <label className="label">
        Tee
        <select className="input"
          name="tee"
          value={roundData.tee}
          onChange={updateRound}
        >
          <option value="male">Mens Tees</option>
		  <option value="female">Ladies Tees</option>
        </select>
      </label>

      <label className="label">
        Tee Name
        <input className="input"
          name="tee_name"
          value={roundData.tee_name}
          onChange={updateRound}
          placeholder="1, 2, 3, white, gold, black, etc."
        />
      </label>

      <label className="label">
        Holes
        <select className="input"
          name="holes"
          value={roundData.holes}
          onChange={updateRound}
        >
          <option value="Front 9">Front 9</option>
		  <option value="Back 9">Back 9</option>
          <option value="18">18</option>
        </select>
      </label>

      <label className="label">
        Notes
        <textarea className="textarea"
          name="notes"
          value={roundData.notes}
          onChange={updateRound}  
        />
      </label>
    </div>
  );
}