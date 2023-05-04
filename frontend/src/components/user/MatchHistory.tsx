import React from 'react';
import { GameInterface } from '../messages/types';
import MatchResume from './MatchResume';

type Props = {
  games: GameInterface[] | undefined;
};

const MatchHistory = ({ games }: Props) => {
  return (
    <div>
      <h2>Match History</h2>
      { games && games.map((game) => (
        <MatchResume key={game?.id} game={game} />
      ))}
    </div>
  );
};

export default MatchHistory;
