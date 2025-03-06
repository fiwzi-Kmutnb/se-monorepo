declare namespace Express {
  export interface Request {
    users: {
      id: number;
      email: string;
      username: string;
      permission: number;
    };
  }
}
