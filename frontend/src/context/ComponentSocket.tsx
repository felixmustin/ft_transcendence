import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { ISocketContextState, SocketContextProvider, SocketReducer, defaultSocketContextState } from './Socket';
import { getSessionsToken } from '../sessionsUtils';

export interface ISocketContextComponentProps extends PropsWithChildren {}

type handshake = {
	uid: string,
	users: string[],
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
	const {children } = props;

	const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
	const [loading, setloading ] = useState(true);

	const token = await.getsessiontoken
	const auth = bearer + 
	const socket = useSocket('ws://127.0.0.1:3001', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
		auth: {
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		},
	});

	useEffect(() =>{
		// connection
		socket.connect();

		// saving the socket
		SocketDispatch({type: 'update_socket', payload: socket});

		// start event listener
		startlisteners();

		// send the handshake 
		sendhandshake();
	}, []);

	const startlisteners = () => {
		//connect
		socket.on('user_connected', (users : string[]) =>{
			console.info('users connected: ' + users);
			SocketDispatch({type: 'update_users', payload: users});
		});

		//disconnect
		socket.on('user_disconnected', (uid: string) =>{
			console.info('user : ' + uid + ' disconnected');
			SocketDispatch({type: 'delete_user', payload: uid});
		});

		// reconnect 
		socket.io.on('reconnect', (attempt) =>{
			console.info('Reconnect on attempt: ' +  attempt);
		});

		//reconnect attempt event 
		socket.io.on('reconnect_attempt', (attempt) =>{
			console.info('reconnection attempt : ' + attempt);
		});

		//reconnection error 
		socket.io.on('reconnect_error', (error) =>{
			console.info('reconnection error : ' + error);
		});

		//reconnnect fail
		socket.io.on('reconnect_failed', () =>{
			console.info('reconnection failure');
			alert('sorry we are unable to reconnect you');
		});
	};
	const sendhandshake = () => {
		console.info('sending handshake');

		// socket.emit('handshake', (uid : string, users: string[]) =>{
		// 	console.log('user handshake callback message received');
		// 	SocketDispatch({type : 'update_uid', payload : uid});
		// 	SocketDispatch({type : 'update_users', payload: users});

		// 	setloading(false);
		// });
		socket.emit('handshake');
		socket.on('handshake-response', (data: handshake) =>{
			console.log('handshake-reponse received with ' + data.uid + ' | ' + data.users);
			SocketDispatch({type : 'update_uid', payload : data.uid});
			SocketDispatch({type: 'update_users', payload: data.users});
			setloading(false);
		});
	};
	
	if (loading) return <p>loading socket IO ...</p>
	return (
		<SocketContextProvider value = {{SocketState, SocketDispatch}}>
			{children}
		</SocketContextProvider>
	);
}

export default SocketContextComponent;