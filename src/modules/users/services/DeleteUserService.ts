import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  role: 'user' | 'admin' | 'agent';
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, role }: IRequest): Promise<void> {
    if (role === 'user') {
      throw new AppError('You do not have permission to delete an user');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    await this.usersRepository.deleteUser(user);
    await this.cacheProvider.invalidate('users-list');
  }
}

export default DeleteUserService;
