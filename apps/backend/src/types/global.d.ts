// declare global {
//   namespace Express {
//     interface Request {
//       users: {
//         id: number;
//         email: string;
//         firstname: string;
//         lastname: string;
//         role: string;
//       };
//     }
//   }
// }

// declare module 'express' {
//   export interface Request {
// users: {
//   id: number;
//   email: string;
//   firstname: string;
//   lastname: string;
//   role: string;
// };
//   }
// }

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
