// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ListAllTicketsByStatusService from './ListAllTicketsByStatusService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let listTickets: ListAllTicketsByStatusService;
describe('ListTicketsByStatus', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    listTickets = new ListAllTicketsByStatusService(fakeTicketRepository);
  });

  it('should be able to list all tickets by status', async () => {
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

    const ticket1 = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'close',
      articles: [],
    });

    const tickets = await listTickets.execute({
      role: agent.role,
      status: 'open',
    });

    expect(tickets).toEqual([ticket1]);
  });

  it('should not be able to list all tickets by status when the user is not an agent', async () => {
    await expect(
      listTickets.execute({ role: 'user', status: 'open' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
