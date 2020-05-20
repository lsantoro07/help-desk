import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let updateProfile: UpdateProfileService;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com.br',
      old_password: '123456',
      password: '123123',
      confirm_password: '123123',
    });

    expect(updatedUser.name).toEqual('John Tre');
    expect(updatedUser.password).toEqual('123123');
  });

  it('should not be able to update of a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'John Tre',
        email: 'johntre@example.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email to an email that is already in use', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await fakeUsersRepository.create({
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jonhtre@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without confirmation of old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jonhtre@example.com',
        password: '123123',
        confirm_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong confirmation password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jonhtre@example.com',
        old_password: '123456',
        password: '123123',
        confirm_password: '1231234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without confirmation password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jonhtre@example.com',
        old_password: '123456',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jonhtre@example.com',
        old_password: '654321',
        password: '123123',
        confirm_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
