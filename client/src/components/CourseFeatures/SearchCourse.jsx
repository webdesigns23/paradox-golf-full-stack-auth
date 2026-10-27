import {useState} from "react";

//helper to normalize data to an array
  function toTeeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

//helper to normalize from JSON string
function parseTees(tees) {
  if (typeof tees === "string") {
    try {
      return JSON.parse(tees);
    } catch {
      return {};
    }
  }
  return tees ?? {};
}

export default function SearchCourses(){
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
  const [details, setDetails] = useState({});

  //search golf courses (external API)
	async function handleSearch(e) {
	e.preventDefault();
	if (!query.trim()) return;

	try {
	  const token = localStorage.getItem("token");
	  const res = await fetch(
		`http://127.0.0.1:5555/courses/search?q=${encodeURIComponent(query)}`,
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

async function loadDetails(courseId) {
  if (details[courseId]) return; // already loaded
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:5555/courses/${courseId}`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`Details failed: ${res.status}`);
    const data = await res.json();
    setDetails((prev) => ({ ...prev, [courseId]: data }));
  } catch (error) {
    console.error("Details failed:", error);
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
      {results.map((course) => {
        const full = details[course.id];
        const tees = parseTees(full?.tees);
        const femaleTees = toTeeArray(tees?.female);
        const maleTees = toTeeArray(tees?.male);

        return(          
          <div key={course.id} 
            className="course-card"
            onClick={() => loadDetails(course.id)}
            style={{ cursor: "pointer"}}
          >
            <h3 className="course-name">{course.course_name}</h3>
            <p className="course-location">{course.location?.address}</p>

            <div className="tee-grid">
              {femaleTees.length > 0 && (
                <div className="tee-column">
                  <h4>Female Tees</h4>
                  <ul className="tee-list">
                    {femaleTees.map((tee, i) => (
                      <li key={i} className="tee-item">
                        {tee.tee_name} — {tee.total_yards} yds, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {maleTees.length > 0 && (
                <div className="tee-column">
                  <h4>Male Tees</h4>
                  <ul className="tee-list">
                    {maleTees.map((tee, i) => (
                      <li key={i} className="tee-item">
                        {tee.tee_name} — {tee.total_yards} yds, Par {tee.par_total}, Rating {tee.course_rating}, Slope {tee.slope_rating}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
      )})}
    </div>
  </section>
);
}