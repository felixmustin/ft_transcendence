import Matchmaking from "../../components/game/Matchmaking";
import Navbar from '../../components/design/Navbar'
import SocketContextComponent from "../../context/ComponentSocket";
import { useEffect, useState } from "react";
import { getSessionsToken } from "../../sessionsUtils";
import { tokenForm } from "../../interfaceUtils";

const Play = () => {
	const [token, setToken] = useState<tokenForm>();
	const [isTokenSet, setIsTokenSet] = useState(false);

  	// Session and auth
  	useEffect(() => {
    async function getToken() {
      const sessionToken = await getSessionsToken();
      setToken(sessionToken);
      setIsTokenSet(true)
    }
    getToken();
  }, []);

	console.log('hello from page ');
	const matchmaking = <Matchmaking />
	return (
		<div>
			<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
        		<div className="xl:max-w-[1280px] w-full">
					<Navbar />
				</div>
			</div>
			<div className="flex justify-evenly">
				<div className="grid grid-cols-2 w-full">
					<SocketContextComponent children={matchmaking} token={token?.accessToken}/>
				</div>
			</div>
		</div>
	);
}

export default Play;