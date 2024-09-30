import { io } from 'socket.io-client';

let socket  // Initialize socket to null or undefined

const socketConnection = (jwt) => {
  // Checking if the socket is already connected
  if (socket && socket.connected) {
    //console.log("socket already connectted")
    return socket;
  } else {
    // If not connected, establish a connection
    socket = io('https://localhost:9000', {
      auth: {
        jwt,
      },
      // Prevent automatic connection
    });
    return socket;
  }
};

export default socketConnection;
