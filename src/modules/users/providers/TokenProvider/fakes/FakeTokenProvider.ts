import ITokenProvider from '../models/ITokenProvider';

interface IAuthUser {
  user_id: string;
  role: 'user' | 'agent' | 'admin';
}

export default class JWTTokenProvider implements ITokenProvider {
  private token = '';

  public generateToken({ user_id, role }: IAuthUser): string {
    const token = JSON.stringify({
      user: {
        id: user_id,
        role,
      },
    });

    return token;
  }
}
