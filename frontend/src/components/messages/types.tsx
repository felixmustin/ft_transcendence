// types.ts

export interface GameInterface {
  id: number;
  player1_id: number;
  player2_id: number;
  player1_score: number;
  player2_score: number;
}

// export interface ProfileInterface {
//   id: number;
//   username: string;
// }

export interface ProfileInterface {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  avatar: Buffer;
  games: GameInterface[];
  statusid: number;
  // profile: ProfileInterface;
  // blocklist: UserInterface[];
}

export interface ChatRoomInterface {
    id: number;
    name: string | null;
    image: {
      type: string,
      data: []
    };
    admins: number[];
    participants: ProfileInterface[];
    mode: string; // Change this to the ChatRoomMode enum if you have it in your frontend code
    password_hash: string | null;
    last_message_id: number | null;
    last_message: MessageInterface | null;
    last_profile_id: number | null;
    last_profile: ProfileInterface | null;
    created_at: Date;
    updated_at: Date;
    messages: MessageInterface[];
    admin: ProfileInterface[];
  }
  
  export interface MessageInterface {
    id: number;
    content: string;
    chatroom_id: number;
    profile_id: number;
    profile: ProfileInterface;
    created_at: string;
  }