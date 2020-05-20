import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import CreateTicketService from './CreateTicketService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let fakeMailProvider: FakeMailProvider;
let createTicket: CreateTicketService;
describe('CreateTicket', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    fakeMailProvider = new FakeMailProvider();
    createTicket = new CreateTicketService(
      fakeTicketRepository,
      fakeUsersRepository,
      fakeMailProvider,
    );
  });

  it('should be able to create a ticket', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });
    const ticket = await createTicket.execute({
      user_id: user.id,
      title: 'Novo ticket',
      description: 'Descrição do novo ticket',
    });

    expect(ticket).toHaveProperty('id');
  });

  it('should not be able to create a ticket with an user that not exists', async () => {
    await expect(
      createTicket.execute({
        user_id: 'non-existing-user',
        title: 'Novo ticket',
        description: 'Descrição do novo ticket',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able send an email to all agents when a ticket is created', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMultipleMails');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });

    await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
      role: 'agent',
    });

    await createTicket.execute({
      user_id: user.id,
      title: 'Novo ticket',
      description: 'Descrição do novo ticket',
    });

    expect(sendEmail).toHaveBeenCalled();
  });
});
