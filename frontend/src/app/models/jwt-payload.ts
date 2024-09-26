export type JWTPayload = {
  sub: number;
  username: string;
  iat: number;
  exp: number;
};
