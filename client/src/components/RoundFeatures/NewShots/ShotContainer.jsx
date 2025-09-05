import ShotList from "./ShotList";

export default function ShotContainer({hole, holeIndex, shot, shotIndex, holesData, setHolesData}) {

	//Update Shots
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
	
	
	//Add Shots
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

	//Remove Shots
	function removeShotRow(holeIndex, shotIndex) {
		setHolesData((prev) =>
		prev.map((h, i) => {
			if(i !== holeIndex) return h;
			const trimmed = h.shots.filter((_,s) => s !== shotIndex);

			const renumber = trimmed.map((s, index) => ({ ...s, stroke_number: index +1}));
			return { ...h, shots: renumber};
		})
	)}

	return(
		<>
		<ShotList
			shots={hole.shots}
			holeIndex={holeIndex}
			updateShot={updateShot} 
			addShotRow={addShotRow} 
			removeShotRow={removeShotRow}
			/>
		</>
	)
}