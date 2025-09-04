// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { RoundContext } from "../../../context/RoundContext";
// import ShotList from "./ShotList"


// export default function ShotContainer() {
// 	const { rounds, setRounds } = useContext(RoundContext);
// 	const [submitting, setSubmitting] = useState(false);
// 	const [error, setError] = useState(null);

// 	const [roundData, setRoundData] = useState({
// 			course_name: "",
// 			course_external_id: 1234,
// 			date: new Date().toISOString().split("T")[0],
// 			tee: "",
// 			tee_name: "",
// 			holes: "",
// 			notes: "",
// 		})

// 	const navigate = useNavigate();

// 	//Update Shot
// 	function updateShot(holeIndex, shotIndex, name, initialValue) {
//     const numeric = ["stroke_number", "start_distance", "penalty"].includes(name);
//     const value = numeric ? (initialValue === "" ? "" : Number(initialValue)) : initialValue;
    
//     setHolesData((prev) =>
//       prev.map((h, i) => {
//         if (i !== holeIndex) return h;
//         return {
//           ...h,
//           shots: h.shots.map((s, _) => (_ === shotIndex ? { ...s, [name]: value} : s)),
//         };
//       })
//     );
//   }
	
// 	//add & remove shots fields
//   	function addShotRow(holeIndex) {
//     	setHolesData((prev) => 
//       	prev.map((h,i) => {
//         	if (i !== holeIndex) return h;
//         	const nextStroke = (h.shots?.length || 0 ) +1;
//         	return {
//           	...h,
//           	shots:[
//            	 ...h.shots,
//             {
//               stroke_number: nextStroke, 
//               start_distance: "", 
//               unit: "yd", 
//               surface: "fairway", 
//               penalty: 0, 
//               club: "", 
//               notes: ""   
//             },
//           ]
//         }
//     })
//   )}

//   function removeShotRow(holeIndex, shotIndex) {
//     setHolesData((prev) =>
//       prev.map((h, i) => {
//         if(i !== holeIndex) return h;
//         const trimmed = h.shots.filter((_,s) => s !== shotIndex);

//         const renumber = trimmed.map((s, index) => ({ ...s, stroke_number: index +1}));
//         return { ...h, shots: renumber};
//       })
//     )
//   }

// 	//reuseability for submit POST fetch
// 	const token = localStorage.getItem("token");
// 	const authHeaders = {
// 		"Content-Type": "application/json",
// 		Accept: "application/json",
// 		...(token ? { Authorization: `Bearer ${token}` } : {}),
// 	};


// 	//handle form submit
// 	async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);
//     setSubmitting(true);

//     try {

//       //Create Shots for that Hole
//       for (const shot of hole.shots) {
//         const sRes = await fetch(`http://127.0.0.1:5555/rounds/${createdRound.id}/holes/${createdHole.id}/shots`, {
//           method: "POST",
//           headers: authHeaders,
//           body: JSON.stringify({
//             stroke_number: shot.stroke_number,
//             start_distance: shot.start_distance === "" ? null : shot.start_distance,
//             unit: shot.unit,
//             surface: shot.surface,
//             penalty: shot.penalty || 0,
//             club: shot.club || "",
//             notes: shot.notes || "",
//           }),
//         });
//         if (!sRes.ok) throw new Error(`Create shot failed: ${sRes.status}`);
//         await sRes.json();
//         }
//       }
         
//       // Update context and sort
      
//       setRounds(prev => {
//         const next = [createdRound, ...prev];
//         next.sort((a,b) => new Date(b.date) - new Date(a.date));
//         return next;
//       })

//       navigate("/rounds");

//       //Reset forms
//       setRoundData({
//         course_name: "",
//         course_external_id: 1234,
//         date: new Date().toISOString().split("T")[0],
//         tee: "",
//         tee_name: "",
//         holes: "",
//         notes: "",
//       });
//       setHolesData([]);

//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }


// 	return(
// 		<>
// 			<ShotList 
// 			shots={hole.shots}
// 			holeIndex={holeIndex}
// 			updateShot={updateShot} 
// 			addShotRow={addShotRow} 
// 			removeShotRow={removeShotRow}
// 			/>
// 		</>
// 	)
// }