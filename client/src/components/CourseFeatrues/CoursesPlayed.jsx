import { useContext, useMemo } from "react";
import { RoundContext } from "../../context/RoundContext";


export default function CoursesPlayed() {
  const { rounds, loading, error } = useContext(RoundContext);

  const courses = useMemo(() => {
    if (!Array.isArray(rounds)) return [];

    const map = new Map();
    for (const r of rounds) {
      const key =
        (r.course_external_id && `ext:${r.course_external_id}`) ||
        (r.course_name && `name:${r.course_name.toLowerCase().trim()}`) ||
        `id:${r.id}`;

      const prev = map.get(key);
      const date = new Date(r.date);

      if (!prev) {
        map.set(key, {
          key,
          course_name: r.course_name || "Unknown Course",
          course_external_id: r.course_external_id ?? null,
          roundsCount: 1,
          lastPlayed: date,
        });
      } else {
        prev.roundsCount += 1;
        if (date > prev.lastPlayed) prev.lastPlayed = date;
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.lastPlayed - a.lastPlayed
    );
  }, [rounds]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!courses.length) return <div>No courses yet</div>;

  return (
    <div className="courses">
      <h1>Courses I've Played</h1>
      <ul className="course-list">
        {courses.map((c) => (
          <li key={c.key} className="course-item">
            <div className="course-name">{c.course_name}</div>
            <div className="course-item">
              Rounds: {c.roundsCount} - Last played:{" "}
              {c.lastPlayed.toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}