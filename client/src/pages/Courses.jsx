import {useState} from "react";

export default function Courses(){
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	//search golf courses (external API)
	async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:5555/courses/search?q=${query}`,
        {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();

      const items =
        (Array.isArray(data?.courses) && data.courses) ||
        (Array.isArray(data?.results) && data.results) ||
        [];

      setResults(items);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
  }

	return(
		<>
			<h1>Find Golf Courses</h1>
			<div>
				<form onSubmit={handleSearch}>
					<input type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search courses..."
					/>
					<button type="submit">Search</button>
				</form>

				<div>
					{results.map((course) => (
						<div key={course.id}>
							<h2>{course?.course_name}</h2>
							<p>Course # {course?.id}</p>
							<p>{course.location?.address}</p>

							{course.tees?.female && (
							<div>
								<h4>Male Tees</h4>
								<ul>
									{course.tees.female.map((tee, i) => (
										<li key={i}>
											{tee.tee_name} - {tee.total_yards} yards, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
										</li>
									))}
								</ul>
							</div>
							)}	

							{course.tees?.male && (
							<div>
								<h4>Male Tees</h4>
								<ul>
									{course.tees.male.map((tee, i) => (
										<li key={i}>
											{tee.tee_name} - {tee.total_yards} yards, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
										</li>
									))}
								</ul>
							</div>
							)}	
						</div>
						)
					)}
				</div>
			</div>

		</>
	)
}