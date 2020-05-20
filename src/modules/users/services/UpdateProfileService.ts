import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
  confirm_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
    confirm_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists && checkEmailExists.id !== user.id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new passoword',
      );
    }

    if (password && !confirm_password) {
      throw new AppError('You need to confirm your new password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      if (password !== confirm_password) {
        throw new AppError('You have to confirm the password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }
    await this.cacheProvider.invalidate('users-list');

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
