import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import UpdateAvatarUserService from './UpdateAvatarUserService';

let updateAvatar: UpdateAvatarUserService;
let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatar = new UpdateAvatarUserService(
      fakeUsersRepository,
      fakeStorageProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to update the user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toEqual('avatar.png');
  });

  it('should not be able to update the avatar of non-existing user', async () => {
    await expect(
      updateAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete the old avatar when updating a new one', async () => {
    const deleteAvatar = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png',
    });

    expect(deleteAvatar).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toEqual('avatar2.png');
  });
});
