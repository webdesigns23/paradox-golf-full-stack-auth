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

	return(
		<RoundContext.Provider value={{
		rounds, setRounds,
		loading, setLoading,
		error, setError,
		}}>
		{children}
		</RoundContext.Provider>
  );
}