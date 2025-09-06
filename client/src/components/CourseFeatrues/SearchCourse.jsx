import {useState} from "react";

export default function SearchCourses(){
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

return (
  <section className="course-search">
    <h2 className="section-title">Course Search</h2>

    <form className="search-form" onSubmit={handleSearch}>
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses..."
      />
      <button className="search-btn" type="submit">Search</button>
    </form>

    <div className="course-results">
      {results.map((course) => (
        <div key={course.id} className="course-card">
          <h3 className="course-name">{course.course_name}</h3>
          <p className="course-location">{course.location?.address}</p>

          <div className="tee-grid">
            {course.tees?.female && (
              <div className="tee-column">
                <h4>Female Tees</h4>
                <ul className="tee-list">
                  {course.tees.female.map((tee, i) => (
                    <li key={i} className="tee-item">
                      {tee.tee_name} — {tee.total_yards} yds, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.tees?.male && (
              <div className="tee-column">
                <h4>Male Tees</h4>
                <ul className="tee-list">
                  {course.tees.male.map((tee, i) => (
                    <li key={i} className="tee-item">
                      {tee.tee_name} — {tee.total_yards} yds, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);
}