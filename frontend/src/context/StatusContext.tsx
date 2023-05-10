import { createContext } from 'react';
import { Socket } from 'socket.io-client';

const StatusSocket = createContext<Socket | undefined>(undefined);

export default StatusSocket;
