import {useState, useEffect, useContext} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { RoundContext } from "../context/RoundContext";
import ShotContainer from "../components/RoundFeatures/NewShots/ShotContainer";
import m from "../assets/images/mgolf.PNG"

export default function AddShots(){
	const {id: roundId } = useParams();
	const { setRounds } = useContext(RoundContext);
	const navigate = useNavigate();
	
	const [ holes, setHoles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showShots, setShowShots] = useState(false);

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
	if (!showShots) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const roundRes = await fetch(`http://127.0.0.1:5555/rounds/${roundId}`, {
          headers: authHeaders,
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

  //save shots
  async function handleSaveShots() {
	try {
		setError(null);
		const requests = [];

		//check for holes
		for (const hole of holes) {
			if (!hole?.id) continue;

			//shot data to hole
			for (const shot of hole.shots || []) {
				const shotData = 
				(shot.start_distance !== "" && shot.start_distance != null) ||
				(shot.penalty && Number(shot.penalty) !==0) ||
				(shot.club && shot.club.trim()) ||
				(shot.notes && shot.notes.trim());

			if (!shotData) continue;

			requests.push(
				fetch(`http://127.0.0.1:5555/rounds/${roundId}/holes/${hole.id}/shots`, {
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
				}).then((response) => {
					if (!response.ok) throw new Error(`Create shot failed: ${response.status}`);
					return response.json();
				}));
			}
		}
		await Promise.all(requests);
		setRounds((prev) => prev);
		navigate("/rounds");
		}catch (e) {
		setError(e.message);
		}
	}

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">Error: {error}</p>;

   	return(
		<div>
			<div>
				<h1>Would you like to add your shot distances?</h1>
				<h2>"Ooooh, it's a little teedious! </h2>
				<h3>But hey, helping you log those shot distances gives me purpose ...and better stats mean a better golf game!</h3>
				<h2> I'm Mr. Meeseeks, look at meee!"</h2>
				<img src={m} />
				<br></br>
				<Link to={`/rounds`}>
					<button>No Thanks</button> 
				</Link>		

				{!showShots && (
					<button type="button" onClick={() => setShowShots(true)}>
						+ Add Shots
					</button>
				)}	
			</div>
			{error && <p className="error">Error: {error}</p>}
			{showShots && loading && <p>Loading…</p>}

			{showShots && !loading && (
				<div>
					{holes.length === 0 ? (
						<p>No holes found for this round.</p>
					) : (
						holes.map((hole, index) => (
							<div key={hole.id ?? index}>
								<h3>Hole {hole.hole_number}</h3>
								<ShotContainer					
									hole={hole}
									holeIndex={index}
									setHolesData={setHoles}
								/>
							</div>
						))
					)}
					<button type="button" 
					onClick={handleSaveShots}>
						Save Shots
					</button>	
				</div>
			)}
		</div>
	)
}