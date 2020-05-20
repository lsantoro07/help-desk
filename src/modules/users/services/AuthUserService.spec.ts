import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@modules/users/providers/TokenProvider/fakes/FakeTokenProvider';

import AuthUserService from './AuthUserService';

let authUser: AuthUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;

describe('AuthUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeTokenProvider = new FakeTokenProvider();
    authUser = new AuthUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeTokenProvider,
    );
  });

  it('should be able to authenticate the user with email and password', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const loggedUser = await authUser.execute({
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    expect(loggedUser).toHaveProperty('token');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      authUser.execute({
        email: 'jonhdoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an email that not exists', async () => {
    await expect(
      authUser.execute({
        email: 'jonhdoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
