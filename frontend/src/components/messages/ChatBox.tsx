import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { ChatRoomInterface, MessageInterface, ProfileInterface } from './types';
import { Socket } from 'socket.io-client';

type Props = {
  roomId?: number;
  id: number;
  socket: Socket | undefined;
  token: string | undefined;
};

const ChatBox = ({ roomId, id, socket, token }: Props) => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [blocked, setBlocked] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBlocked = async () => {
      const url = 'http://localhost:3001/user/blocked/list';
      const auth = 'Bearer ' + token;
      try {
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': auth } });
        const result = await res.json();
        console.log(result);
        if (res.ok)
          setBlocked(result);
      } catch (error : any) {
        console.log(error);
      }
    }
    fetchBlocked();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="overflow-y-auto h-[25rem] max-h-[25rem]">
      {messages.map((message) => (
        <Message key={message.id} message={message} currentUserId={id} blocked={blocked}/>
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatBox;
