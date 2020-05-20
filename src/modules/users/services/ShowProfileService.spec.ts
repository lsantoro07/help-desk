import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let showProfile: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile users', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile).toEqual(user);
  });

  it('should not be able to show the profile of an user that not exist', async () => {
    await expect(
      showProfile.execute({ user_id: 'non-existing-user' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
