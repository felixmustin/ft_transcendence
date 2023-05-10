import React, { useEffect, useState } from 'react';
import SingleParticipant from './SingleParticipant';
import { ChatRoomInterface, ProfileInterface } from './types';

type Props = {
  roomId: number;
  profileId: number
};

const Participants = ({ roomId, profileId }: Props) => {
  const [users, setUsers] = useState<ProfileInterface[]>([]);
  const [room, setRoom] = useState<ChatRoomInterface>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/chatroom/${roomId}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching the conversation:', error);
      }
    };
    fetchUsers();
  }, [roomId]);


  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`http://localhost:3001/chatroom/room/${roomId}`);
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching the conversation:', error);
      }
    };
    fetchGame();
  }, [roomId]);

  return (
    <div className="overflow-x-scroll whitespace-nowrap my-2">
      {room && users.map((user) => (
        <SingleParticipant key={user.id} user={user} room={room} profileId={profileId} />
      ))}
    </div>
  );
};

export default Participants;
