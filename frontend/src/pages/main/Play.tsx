import GamePong from "../../components/game/Pong";
import Navbar from '../../components/design/Navbar'


const Play = (props: Props) => {
	console.log('hello from page ');
	return (
		<div>
			<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
        		<div className="xl:max-w-[1280px] w-full">
					<Navbar />
				</div>
			</div>
			<div className="flex justify-evenly">
				<div className="grid grid-cols-2 w-full">
					<GamePong />
				</div>
			</div>
		</div>
	);
}

export default Play;