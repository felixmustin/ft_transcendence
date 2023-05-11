import React, { useState, useEffect } from 'react';
import OneLadder from './OneLadder';

type Props = {
  token: string;
};

const Ladder = (props: Props) => {
  const [ladder, setLadder] = useState<{ username: string; won: number }[]>([]);

  useEffect(() => {
    const fetchLadderData = async () => {
      const auth = 'Bearer ' + props.token;
      try {
        const response = await fetch('http://localhost:3001/user/ladder', { method: 'GET', headers: { Authorization: auth } });
        const data = await response.json();
        setLadder(data);
      } catch (error) {
        console.error('Error fetching ladder data:', error);
      }
    };

    fetchLadderData();
  }, []);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-violet-900 rounded-lg w-[600px] items-center m-5">
        <h1 className="text-center text-4xl p-3 mt-2">Ladder</h1>
        <hr className="w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900" />
        <div className="overflow-y-auto max-h-[420px]">
          <div className="flex justify-center items-center text-center text-xl underline p-2">
            <p className="w-1/3 text-left ml-4">RANK</p>
            <p className="w-1/3">USERNAME</p>
            <p className="w-1/3 text-right mr-4">GAMES WON</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            {ladder.map((item, index) => (
              <div className="w-full justify-center" key={index}>
                <OneLadder item={item} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ladder;
