import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<User[] | null> {
    let users = await this.cacheProvider.recover<User[]>('users-list');

    if (!users) {
      users = await this.usersRepository.findAllUsers();
      await this.cacheProvider.save('users-list', users);
    }

    return users;
  }
}

export default ListUsersService;
