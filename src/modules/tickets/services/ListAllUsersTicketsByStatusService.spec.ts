import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ListAllUsersTicketsByStatusService from './ListAllUsersTicketsByStatusService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let listTickets: ListAllUsersTicketsByStatusService;
describe('ListTicketsStatus', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    listTickets = new ListAllUsersTicketsByStatusService(
      fakeTicketRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list all users tickets by status', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'user',
    });

    const ticket1 = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await fakeTicketRepository.create({
      user: user1,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'pending user',
      articles: [],
    });

    const tickets = await listTickets.execute({
      status: 'open',
      user_id: user.id,
    });

    expect(tickets).toEqual([ticket1]);
  });

  it('should not be able to list tickets from an user that not exists', async () => {
    await expect(
      listTickets.execute({
        status: 'open',
        user_id: 'non-existing user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
