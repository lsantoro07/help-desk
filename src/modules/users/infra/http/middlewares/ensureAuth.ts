import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayLoad {
  user: {
    id: string;
    role: 'user' | 'agent' | 'admin';
  };
  iat: number;
  exp: number;
  sub: string;
}
export default function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { user } = decoded as ITokenPayLoad;

    request.user = { id: user.id, role: user.role };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
