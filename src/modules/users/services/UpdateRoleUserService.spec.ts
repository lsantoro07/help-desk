import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import UpdateRoleUserService from './UpdateRoleUserService';

let updateRoleUser: UpdateRoleUserService;
let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateRoleUser', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateRoleUser = new UpdateRoleUserService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update the role of an user', async () => {
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

    const updatedUser = await updateRoleUser.execute({
      user_id: user.id,
      role: 'agent',
      agent_role: agent.role,
    });

    expect(updatedUser.role).toEqual('agent');
  });

  it('should not be able to update the role of an user with an user that is not an agent or an admin', async () => {
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
      updateRoleUser.execute({
        user_id: user.id,
        role: 'agent',
        agent_role: agent.role,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the role of an user that not exists', async () => {
    await expect(
      updateRoleUser.execute({
        user_id: 'non-existing user',
        role: 'agent',
        agent_role: 'agent',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
