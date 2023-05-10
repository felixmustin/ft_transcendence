import React from 'react';
import { MessageInterface } from './types';

type Props = {
  message: MessageInterface;
  currentUserId: number;
  blocked: number[];
};

const Message = ({ message, currentUserId, blocked }: Props) => {
  const isCurrentUser = message.profile_id === currentUserId;
  const isBlocked = blocked.includes(message.profile_id);

  // If the sender is blocked, don't display the message
  if (isBlocked) {
    return null; // Or return some placeholder component if you prefer
  }

  return (
    <div
      className={`chat chat-start flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div>
        {!isCurrentUser && (
          <p className="text-gray-600 text-sm mb-1">{message.profile.username}</p>
        )}
        <div
          className={`inline-block bg-${
            isCurrentUser ? 'gradient-to-tl from-yellow-400 via-yellow-400 to-black' : 'gradient-to-tl from-violet-900 via-black to-black'
          } rounded-md px-4 py-2 mb-4 max-w-[200-px]`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default Message;
