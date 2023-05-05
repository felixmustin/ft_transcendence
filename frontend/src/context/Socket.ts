import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface ISocketContextState {
	socket : Socket | undefined ;
	uid : string;
	users : string[];
	data : string;
}

export const defaultSocketContextState: ISocketContextState = {
	socket : undefined, 
	uid : '',
	users : [],
	data : '',
}

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'delete_user' | 'update_data';

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
	type : TSocketContextActions;
	payload : TSocketContextPayload;
}

export const SocketReducer = (state : ISocketContextState, action: ISocketContextActions) => {
	// console.log('message received - action ${action.type} - Payload: ', action.payload);

	switch(action.type){
		case 'update_socket':
			return { ...state, socket : action.payload as Socket};
		case 'update_uid':
			return { ...state, uid : action.payload as string};
		case 'update_users':
			return { ...state, users : action.payload as string[]};
		case 'delete_user':
			return { ...state, users : state.users.filter((uid) => uid !== action.payload as string)};
		case 'update_data':
			return { ...state, data : action.payload as string};
		default :
			return { ...state };
	}
}

export interface ISocketContextProps {
	SocketState: ISocketContextState;
	SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
	SocketState: defaultSocketContextState,
	SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;