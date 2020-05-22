import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

import ITokenProvider from '../models/ITokenProvider';

interface IAuthUser {
  user_id: string;
  role: 'user' | 'agent';
}

export default class JWTTokenProvider implements ITokenProvider {
  public generateToken({ user_id, role }: IAuthUser): string {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        user: {
          id: user_id,
          role,
        },
      },
      secret,
      {
        subject: user_id,
        expiresIn,
      },
    );

    return token;
  }
}
