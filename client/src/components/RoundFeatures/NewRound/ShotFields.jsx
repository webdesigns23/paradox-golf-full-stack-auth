import { useState } from "react";

export default function ShotFields() {
	const [shotData, setShotData] = useState({
		stroke_number: 1,
		start_distance: "",
		unit: "yd",
		surface: "tee",
		penalty: 0,
		club: "",
		notes: "",
	})

	function updateShot(index, field, value) {
		const numeric = ["stroke_number", "start_distance", "penalty"].includes(field);
		setShotData((prev) => prev.map((shot, i) => (i === index ? { ...shot, [field]: numeric ? Number(value) : value } : shot)))
	}

	return (
		<div className="form_section">
			<h3 className="h3">Shots</h3>

			
		</div>
	);
}