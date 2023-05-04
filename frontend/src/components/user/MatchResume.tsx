import React from 'react'
import { GameInterface } from '../messages/types'

type Props = {
  game: GameInterface | undefined;
}

const MatchResume = ({ game }: Props) => {
  return (
    <div>
      <p>Match between {game?.player1_id} and {game?.player2_id}</p>
      <p>Score: {game?.player1_score} - {game?.player2_score}</p>
    </div>
  )
}

export default MatchResume