// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ListAllTicketsService from './ListAllTicketsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let listTickets: ListAllTicketsService;
describe('ListTickets', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    listTickets = new ListAllTicketsService(fakeTicketRepository);
  });

  it('should be able to list all tickets', async () => {
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

    const ticket2 = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    const tickets = await listTickets.execute({ role: agent.role });

    expect(tickets).toEqual([ticket1, ticket2]);
  });

  it('should not be able to list all tickets with the user is not an agent', async () => {
    await expect(listTickets.execute({ role: 'user' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
