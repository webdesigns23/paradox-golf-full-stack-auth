import React, { createContext, useState, useEffect } from "react";

export const RoundContext = createContext(null);

export function RoundsProvider({children}){

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lists all rounds
	useEffect(() => {
		async function fetchData() {
		try{
			const token = localStorage.getItem("token");
			const response = await fetch("http://127.0.0.1:5555/rounds", {
				headers: {
					"Accept": "application/json",
					...(token ? {Authorization: `Bearer ${token}`}: {}),
				},
			});
			if (!response.ok) {
			throw new Error(`HTTP error!: ${response.status}`);
			}
			const data = await response.json();
			setRounds(Array.isArray(data) ? data : []);
		} catch (error){
			setError(error.message);
		}finally{
			setLoading(false);
		}
		};
		fetchData()
	}, [])
	

	//Delete Round
	async function deleteRound(round_id) {
		setError(null)
		setLoading(true);

		try {			
			const token = localStorage.getItem("token");
			const response = await fetch (`http://127.0.0.1:5555/rounds/${round_id}`,{
				method: "DELETE",
				headers:{
					"Accept": "application/json",
					...(token ? {Authorization: `Bearer ${token}`}: {}),
				},
			});
			if (!response.ok && response.status !==204) {
				throw new Error(`${response.status}`);
			}
			setRounds(prev => prev.filter((r) => r.id !== round_id));
		} catch (error) {
			setError(`Failed to delete round: ${error.message || error}`)
		} finally {
			setLoading(false);
		}
	}

	return(
		<RoundContext.Provider value={{
		rounds, setRounds,
		loading, setLoading,
		error, setError,
		deleteRound,
		}}>
		{children}
		</RoundContext.Provider>
  );
}