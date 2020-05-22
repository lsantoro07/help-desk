import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ShowTicketInfoService from './ShowTicketInfoService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let showTicket: ShowTicketInfoService;
describe('ShowTicket', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    showTicket = new ShowTicketInfoService(
      fakeTicketRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to show the ticket information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    const ticketInfo = await showTicket.execute({
      user_id: user.id,
      ticket_id: ticket.id,
    });

    expect(ticketInfo).toEqual(ticket);
  });

  it('should not be able to show the ticket information when the user is not the owner nor an agent or responsible', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await expect(
      showTicket.execute({
        user_id: user2.id,
        ticket_id: ticket.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to show the ticket information when the user not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await expect(
      showTicket.execute({
        user_id: 'non-existing-user',
        ticket_id: ticket.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to show the ticket that not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      showTicket.execute({
        user_id: user.id,
        ticket_id: 'non-existing-ticket',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
