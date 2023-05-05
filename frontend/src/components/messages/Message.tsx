import React from 'react';
import { MessageInterface } from './types';

type Props = {
  message: MessageInterface;
  currentUserId: number;
};

const Message = ({ message, currentUserId }: Props) => {
  const isCurrentUser = message.user_id === currentUserId;

  return (
    <div
      className={`chat chat-start flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div>
        {!isCurrentUser && (
          <p className="text-gray-600 text-sm mb-1">{message.user.profile.username}</p>
        )}
        <div
          className={`inline-block bg-${
            isCurrentUser ? 'yellow-400' : 'violet-700'
          } rounded-md px-4 py-2 mb-4 max-w-4/5 break-words`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default Message;
