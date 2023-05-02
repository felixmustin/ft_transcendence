// types.ts

export interface ProfileInterface {
  id: number;
  username: string;
}

export interface ChatRoomInterface {
    id: number;
    name: string | null;
    image: string | null;
    mode: string; // Change this to the ChatRoomMode enum if you have it in your frontend code
    password_hash: string | null;
    messages: MessageInterface[];
    last_message_id: number | null;
    last_user_id: number | null;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface MessageInterface {
    id: number;
    content: string;
    chatroom_id: number;
    user_id: number;
    created_at: string;
  }