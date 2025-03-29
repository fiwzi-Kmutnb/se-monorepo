import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    users: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      role: string;
    };
  }
}
