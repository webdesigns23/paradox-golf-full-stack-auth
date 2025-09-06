import meeseekTips from "../assets/images/meeseeks/meeseek_tips.jpeg"

export default function Home({user}) {
	return(
		<>
			<h1>"hi {user?.username}!"</h1>
			<h2 className="tagline">“I'm Mr. Meeseeks! Look at me!” ...your friendly golf sidekick.</h2>
			<h2>"Want me to help you get 2 strokes off your golf game!"</h2>

			<img src={meeseekTips} width="40%" alt="meeseeks on golf course"/>
			
		</>
	);
};