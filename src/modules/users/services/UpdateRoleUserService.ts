import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  role: 'user' | 'agent';
  agent_role: 'user' | 'agent';
}

@injectable()
class UpdateRoleUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, role, agent_role }: IRequest): Promise<User> {
    if (agent_role === 'user') {
      throw new AppError(
        'Only authenticated agent users can change users role',
        401,
      );
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    user.role = role;

    await this.usersRepository.save(user);
    await this.cacheProvider.invalidate('users-list');

    return user;
  }
}

export default UpdateRoleUserService;
