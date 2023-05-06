import Matchmaking from "../../components/game/Matchmaking";
import Navbar from '../../components/design/Navbar'
import SocketContextComponent from "../../context/ComponentSocket";
import { useEffect, useState } from "react";
import { getSessionsToken, isSessionTokenSet } from "../../sessionsUtils";
import { tokenForm } from "../../interfaceUtils";
import { useNavigate } from "react-router-dom";
import Ladder from "../../components/game/Ladder";

const Play = () => {
	const [token, setToken] = useState<tokenForm>();
	// Error management
	const [error, setError] = useState(null);
	// Loading management
	const [isLoaded, setIsLoaded] = useState(false);
	// User data retrieved from the API
	const [user, setUser] = useState([]);
	// Navigation
	const navigate = useNavigate();

  	// Session and auth
  	useEffect(() => {
		  if (!isSessionTokenSet()) // '!'token
		  navigate('/');
		  else {
			  async function fetchReq(){
				  const token = await getSessionsToken();
				  setToken(token);
				  const auth = 'Bearer ' + token.accessToken;
				  fetch('http://localhost:3001/user/id/', {method: 'GET', headers: {'Authorization': auth}})
				  .then(res => res.json())
				  .then(
					  
					  (result) => {
						  if (result.statusCode === 401)
						  navigate('/');
						  else {
							  setIsLoaded(true);
							  setUser(result);
							}
						},
						(error) => {
							setIsLoaded(true);
							setError(error);
						}
						)
					}
					fetchReq()
				}
			}, [])
			
			const matchmaking = <Matchmaking />
			return (
				<div>
			<div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
        		<div className="xl:max-w-[1280px] w-full">
					<Navbar item={token}/>
				</div>
			</div>
			<div className="flex justify-evenly">
				<div className="grid grid-cols-2 w-full">
				{token ? (
						<SocketContextComponent children={matchmaking} token={token.accessToken} adress="ws://127.0.0.1:3001/play" />
					) : (
						<p>Loading...</p>
					)}
          <Ladder />
				</div>
			</div>
		</div>
	);
}

export default Play;