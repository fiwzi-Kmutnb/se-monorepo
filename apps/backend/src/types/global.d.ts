declare namespace Express {
  export interface Request {
    users: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      role: string;
    };
  }
}
