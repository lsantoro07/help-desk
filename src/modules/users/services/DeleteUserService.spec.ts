import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

let deleteUser: DeleteUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteUser = new DeleteUserService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to delete an user', async () => {
    const delUser = jest.spyOn(fakeUsersRepository, 'deleteUser');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'agent',
    });

    await deleteUser.execute({ user_id: user.id, role: agent.role });

    expect(delUser).toHaveBeenCalledWith(user);
  });

  it('should not be able to delete an user with user who is deleting has an user role', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      deleteUser.execute({ user_id: user.id, role: agent.role }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete an user that not exists', async () => {
    await expect(
      deleteUser.execute({ user_id: 'non-existing user', role: 'agent' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
