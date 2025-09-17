export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  name:string;
  lastName:string;
}