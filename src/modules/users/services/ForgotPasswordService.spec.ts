import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../infra/typeorm/repositories/fakes/FakeUsersTokensRepository';
import ForgotPasswordService from './ForgotPasswordService';

let forgotPassword: ForgotPasswordService;
let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeMailProvider: FakeMailProvider;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    forgotPassword = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokensRepository,
    );
  });

  it('should be able to recover the password', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await forgotPassword.execute({ email: 'jonhdoe@example.com' });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover the password from an user that not exists', async () => {
    await expect(
      forgotPassword.execute({ email: 'jonhdoe@example.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
