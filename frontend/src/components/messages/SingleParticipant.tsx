import React, { useEffect, useState } from 'react';
import { ChatRoomInterface, UserInterface } from './types';

type Props = {
  user: UserInterface;
  currentUserId: number;
  room: ChatRoomInterface;
};

const SingleParticipant = ({ user, currentUserId, room }: Props) => {

  return (
    <div className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 m-2 rounded-lg shadow-md">
      <div className="mr-4">{user.profile.username}</div>
      { user.id !== currentUserId && <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700">
        Button 1
      </button>}
      { user.id !== currentUserId && <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
        Button 2
      </button>}
      { user.id !== currentUserId && <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
        Button 3
      </button>}
    </div>
  );
};

export default SingleParticipant;
