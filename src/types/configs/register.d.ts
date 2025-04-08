export interface LoginType {
  username: string;
  email?: string;
  password: string;
}
export interface InistallApplicationType {
  host: string;
  port: number;
  username: string;
  password: string;
}
export interface RegisterUser {
  userId?: string;
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
}
