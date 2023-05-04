import React, { useEffect, useState } from 'react'
import { UserInterface } from './types';

type Props = {
  roomId: number;
  id: number;
}

const Participants = ({ roomId, id }: Props) => {

  const [users, setUsers] = useState<UserInterface[]>([]);

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


  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <a href={`http://localhost:3000/profile/${user.profile.username}`}>{user.profile.username}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Participants