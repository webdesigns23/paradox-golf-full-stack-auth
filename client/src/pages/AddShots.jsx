import {useState, useEffect, useContext} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { RoundContext } from "../context/RoundContext";
import ShotContainer from "../components/RoundFeatures/NewShots/ShotContainer";

export default function AddShots(){
	const {id: roundId } = useParams();
	const { rounds, setRounds } = useContext(RoundContext);
	const navigate = useNavigate();
	
	const [ holes, setHoles] = useState([]);
	const [loading, setLoading] = useState(false);
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


	//reuseability for submit POST fetch
	const token = localStorage.getItem("token");
	const authHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	//holes to array, backend as object
	const toArray = (value) =>
    Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];

	//normalize hole data
	const normalizeHole = (h) => ({
		id: h.id,
		hole_number: h.hole_number ?? null,
		par: h.par ?? null,
		score: h.score ?? null,
		shots: Array.isArray(h.shots) ? h.shots : [],
	});

	//Load hole data from round to add holes too
	useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const roundRes = await fetch(`http://127.0.0.1:5555/rounds/${roundId}`, {
          headers: getHeaders(),
        });
        if (!roundRes.ok) throw new Error(`Load round failed: ${roundRes.status}`);
        const round = await roundRes.json();

        let holesRaw =
          (round?.round_holes && toArray(round.round_holes)) ||
          (round?.holes && typeof round.holes !== "string" && toArray(round.holes)) ||
          [];

        if (!holesRaw.length) {
          const hRes = await fetch(`http://127.0.0.1:5555/rounds/${roundId}/holes`, {
            headers: authHeaders,
          });
          if (hRes.ok) holesRaw = toArray(await hRes.json());
        }

        const normalized = holesRaw
          .map(normalizeHole)
          .sort((a, b) => (a.hole_number ?? 0) - (b.hole_number ?? 0));

        setHoles(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [roundId]);



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



	return(
		<>
			<h1>Add Shots</h1>
			<button>
				+ Add Shots
			</button>
			
			<Link to={`/rounds`}>
				<button>No Thanks</button>
			</Link>	
			
		</>
	)
}