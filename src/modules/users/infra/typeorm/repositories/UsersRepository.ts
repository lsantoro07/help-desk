import { Repository, getRepository, Not } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findAllUsers(): Promise<User[] | null> {
    const users = await this.ormRepository.find();

    return users;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      role: 'user',
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async deleteUser(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }

  public async findAllAgents(): Promise<User[] | undefined> {
    const agents = await this.ormRepository.find({
      select: ['email'],
      where: {
        role: Not('user'),
      },
    });

    return agents;
  }
}

export default UsersRepository;
