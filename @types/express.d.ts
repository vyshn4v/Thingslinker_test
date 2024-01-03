declare namespace Express {
  interface Request {
    user?: {
      email: string;
      iat: number;
      exp: number;
    };
  }
}
