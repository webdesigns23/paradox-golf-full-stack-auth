import { useEffect, useState } from "react";

export default function useRoundHoles(roundId) {
	const [holes, setHoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!roundId) return;
		let cancelled = false;
		 
		async function load() {
		try {
			setLoading(true);
			setError(null);
			const token = localStorage.getItem("token");
			const res = await fetch(`http://127.0.0.1:5555/rounds/${roundId}/holes`, {
			headers: {
				Accept: "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});

			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			if (!cancelled) setHoles(Array.isArray(data) ? data : []);
		} catch (e) {
			if (!cancelled) setError(e.message || "Failed to load holes");
		} finally {
			if (!cancelled) setLoading(false);
		}
		}
		load();
		return () => {cancelled = true};
	}, [roundId]);

	const totalStrokes = holes.reduce((sum, h) => sum + (h.score ?? 0), 0);
	
	return {holes, loading, error, totalStrokes};
}