import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ListAllUsersTicketsService from './ListAllUsersTicketsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let showTicket: ListAllUsersTicketsService;
describe('ListUsersTickets', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    showTicket = new ListAllUsersTicketsService(
      fakeTicketRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list all users tickets', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
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

    const tickets = await showTicket.execute({
      user_id: user.id,
    });

    expect(tickets).toEqual([ticket1, ticket2]);
  });

  it('should not be able to list tickets of an user that not exists', async () => {
    await expect(
      showTicket.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
