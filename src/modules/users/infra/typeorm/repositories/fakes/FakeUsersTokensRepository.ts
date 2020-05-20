import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUsersTokensRepository';

import UserToken from '../../entities/UserToken';

export default class FakeUsersTokensRepository
  implements IUserTokensRepository {
  private usersTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(
      findToken => findToken.token === token,
    );
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.usersTokens.push(userToken);

    return userToken;
  }
}
