import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../hooks/usesocket';
import { defaulSocketContextState, SocketContextProvider, SocketReducer } from './Socket';

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
	const {children } = props;

	const {SocketState, SocketDispatch} = useReducer(SocketReducer, defaulSocketContextState);
	const {loading, setloading } = useState(true);

	const socket = useSocket('ws://127.0.0.1:3001', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
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

		socket.emit('handshake', (uid : string, users: string[]) =>{
			console.log('user handshake callback message received');
			SocketDispatch({type : 'update_uid', payload : uid});
			SocketDispatch({type : 'update_users', payload: users});

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