import React from 'react';
import { ChatRoomInterface, ProfileInterface } from './types';

type Props = {
  user: ProfileInterface;
  currentUserId: number;
  room: ChatRoomInterface;
};

const SingleParticipant = ({ user, currentUserId, room }: Props) => {
  const isAdmin = room.admins.some((adminId) => adminId === currentUserId);

  return (
    <div className="inline-flex items-center bg-gray-300 text-black px-4 py-2 m-2 rounded-lg shadow-md">
      <div className="mr-4 font-bold">{user.username}</div>
      {user.id !== currentUserId && (
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded mr-2 hover:bg-black">
          Play
        </button>
      )}
      {user.id !== currentUserId && (
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded mr-2 hover:bg-black">
          Visit
        </button>
      )}
      {user.id !== currentUserId && isAdmin && (
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded hover:bg-black">
          U
        </button>
      )}
    </div>
  );
};

export default SingleParticipant;
