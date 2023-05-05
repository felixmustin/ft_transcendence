import React, { useState } from 'react';
import Message from './Message';
import { ChatRoomInterface, MessageInterface, UserInterface } from './types';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

type Props = {
  roomId?: number;
  id: number;
  socket: Socket | undefined;
};

const ChatBox = ({ roomId, id, socket }: Props) => {

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [blocklist, setBlocklist] = useState<UserInterface[]>([]);

  useEffect(() => {
    if (!socket) return;
    // Fetch the entire conversation of the room
    const fetchConversation = async () => {
      try {
        const response = await fetch(`http://localhost:3001/messages/${roomId}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching the conversation:', error);
      }
    };
    fetchConversation();
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join_room", roomId);

    const handleUpdateConversation = (updatedMessages: MessageInterface[]) => {
      setMessages(updatedMessages);
    };

    socket.on("update_conversation", handleUpdateConversation);

    return () => {
      socket.off("update_conversation", handleUpdateConversation);
      socket.emit("leave_room", roomId);
    };
  }, [socket, roomId]);

  return (
    <div className="overflow-y-auto">
      {messages.map((message) => (
        <Message key={message.id} message={message} currentUserId={id} />
      ))}
    </div>
  );
};

export default ChatBox;
