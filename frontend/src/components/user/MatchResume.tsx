import React, { useEffect, useState } from 'react';
import { GameInterface } from '../messages/types';

type Props = {
  game: GameInterface | undefined;
  currentUserId: number | undefined;
};

const MatchResume = ({ game, currentUserId }: Props) => {
  const [player1, setPlayer1] = useState<string | null>(null);
  const [player2, setPlayer2] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (id: number | undefined, setter: (name: string) => void) => {
      if (!id) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/user/username/${id}`, { method: 'GET' });
        const userData = await response.text();
        setter(userData);
      } catch (error) {
        console.error(`Error fetching user data for ID ${id}:`, error);
      }
    };

    fetchUserData(game?.player1_id, setPlayer1);
    fetchUserData(game?.player2_id, setPlayer2);

    if (game) {
      const currentUserScore =
        game.player1_id === currentUserId ? game.player1_score : game.player2_score;
      const opponentScore =
        game.player1_id === currentUserId ? game.player2_score : game.player1_score;
      const scoreDifference = currentUserScore - opponentScore;

      if (scoreDifference > 0) {
        setOutcome(scoreDifference >= 6 ? 'Stomp' : 'Won');
      } else {
        setOutcome('Lost');
      }
    }
  }, [game, currentUserId]);

  const backgroundColor = outcome === 'Won' ? 'bg-green-500' : outcome === 'Lost' ? 'bg-red-500' : 'bg-gradient-to-tl from-yellow-400 via-yellow-400 to-white';

  const currentPlayerName = game?.player1_id === currentUserId ? player1 : player2;
  const opponentName = game?.player1_id === currentUserId ? player2 : player1;
  const currentPlayerScore = game?.player1_id === currentUserId ? game?.player1_score : game?.player2_score;
  const opponentScore = game?.player1_id === currentUserId ? game?.player2_score : game?.player1_score;

  return (
    <div className={`p-3 my-2 rounded-lg ${backgroundColor}`}>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {outcome && (
            <span className="inline-block mr-2 p-1 rounded-md bg-gray-800 text-white">
              {outcome}
            </span>
          )}
        </div>
        <div className="flex-grow text-center text-black font-medium">
          <span>Match between </span><span className='font-bold'>{currentPlayerName}</span><span> and </span><span className='font-bold'>{opponentName}</span>
        </div>
        <div className='text-black'>
          Score: {currentPlayerScore} - {opponentScore}
        </div>
      </div>
    </div>
  );
};

export default MatchResume;
