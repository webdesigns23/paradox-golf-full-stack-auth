import meeseek from "../assets/images/meeseeks/meeseek.PNG"

export default function About() {
	return(
		<>
			<h1>Paradox Golf</h1>
			<h2>Track your golf game and embrace the contradiction</h2>

			<img src={meeseek} width="60%" alt="meeseeks on golf course"/>

			<p>Golf is a game of paradoxes. It always seems like the harder you swing, the worse it gets, the shortest putt can feel like the hardest, and one perfect shot can erase 17 terrible holes or vice versa. Paradox Golf is designed for both casual and serious golfers looking for a fun and engaging way to improve their game. Paradox Golf keeps you aware of your numbers, while also keeping your round lighthearted as golf rounds can sometimes feel a bit absurd.</p>
		</>
	);
};