import Matchmaking from "../../components/game/Matchmaking";
import Navbar from '../../components/design/Navbar'
import SocketContextComponent from "../../context/ComponentSocket";
import React, { useEffect, useState } from "react";
import Ladder from "../../components/game/Ladder";
import SocketContext from "../../context/Socket";
import { noti_payload } from "../../App";

type Props = {
	token: string;
  }
  
const Play = ({token}: Props) => {
  
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [user, setUser] = useState([]);

	const { SocketState, SocketDispatch } = React.useContext(SocketContext);

			const matchmaking = <Matchmaking statusocket={SocketState} />
			return (
				<div>
			<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
        		<div className="xl:max-w-[1280px] w-full">
					<Navbar />
				</div>
			</div>
			<div className="flex justify-evenly">
				<div className="grid grid-cols-2 w-full">
				{token ? (
						<SocketContextComponent children={matchmaking} token={token} adress="ws://127.0.0.1:3001/play" />
					) : (
						<p>Loading...</p>
					)}
          <Ladder token={token}/>
				</div>
			</div>
		</div>
	);
}

export default Play;