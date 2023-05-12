import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomInterface, ProfileInterface } from './types';

type Props = {
  user: ProfileInterface;
  room: ChatRoomInterface;
  profileId: number;
};

const SingleParticipant = ({ user, room, profileId }: Props) => {

  const navigate = useNavigate();
  const visitUser = () => {
    navigate(`/profile/${user.username}`);
  };

  const isAdmin = room.admins.some((adminId) => adminId === profileId);

  const getStatusDotColor = (statusId: number) => {
    switch (statusId) {
      case 0:
        return 'bg-gray-500';
      case 1:
        return 'bg-green-500';
      case 2:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="inline-flex items-center bg-gray-300 text-black px-4 py-2 m-2 rounded-lg shadow-md">
      {user.id !== profileId && (
        <span
          className={`w-2 h-2 mr-2 rounded-full ${getStatusDotColor(
            user.statusid
          )}`}
        ></span>
      )}
      <div className="mr-4 font-bold">{user.username}</div>
      {user.id !== profileId && (
        <button className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded mr-2 px-1 hover:bg-black">
          Play
        </button>
      )}
      {user.id !== profileId && (
        <button
        className="bg-gradient-to-tl from-violet-900 via-black to-black text-white font-xs rounded px-1 hover:bg-black"
        onClick={visitUser}>
          Visit
        </button>
      )}
    </div>
  );
};

export default SingleParticipant;