export interface TokenParse {
  /**
   * 用户id
   */
  "sub": number;
  "username": string;
  "role": "User" | "Admin";
  "iat": number;
  "exp": number;
}