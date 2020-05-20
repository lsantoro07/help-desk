import { uuid } from 'uuidv4';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../../entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAllUsers(): Promise<User[] | null> {
    return this.users;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user: User = new User();

    Object.assign(
      user,
      {
        id: uuid(),
      },
      data,
    );

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;
    return this.users[findIndex];
  }

  public async deleteUser(user: User): Promise<void> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users.splice(findIndex, 1);
  }

  public async findAllAgents(): Promise<User[] | undefined> {
    const findAgents = this.users.filter(user => user.role !== 'user');

    return findAgents;
  }
}

export default FakeUsersRepository;
