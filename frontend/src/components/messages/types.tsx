// types.ts

export interface ProfileInterface {
  id: number;
  username: string;
}

export interface UserInterface {
  id: number;
  statusid: number;
  profile: ProfileInterface;
  blocklist: UserInterface[];
}

export interface ChatRoomInterface {
    id: number;
    name: string | null;
    image: string | null;
    participants: UserInterface;
    mode: string; // Change this to the ChatRoomMode enum if you have it in your frontend code
    password_hash: string | null;
    last_message_id: number | null;
    last_message: MessageInterface | null;
    last_user_id: number | null;
    last_user: UserInterface | null;
    created_at: Date;
    updated_at: Date;
    messages: MessageInterface[];
  }
  
  export interface MessageInterface {
    id: number;
    content: string;
    chatroom_id: number;
    user_id: number;
    user: UserInterface;
    created_at: string;
  }