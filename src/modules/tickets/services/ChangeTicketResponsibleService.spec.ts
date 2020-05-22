import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import ChangeTicketResponsibleService from './ChangeTicketResponsibleService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let changeResponsible: ChangeTicketResponsibleService;
describe('ChangeResponsible', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    changeResponsible = new ChangeTicketResponsibleService(
      fakeTicketRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to change the responsible of a ticket', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'agent',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    const updatedTicket = await changeResponsible.execute({
      agent_id: agent.id,
      ticket_id: ticket.id,
    });

    expect(updatedTicket.responsible.id).toEqual(agent.id);
  });

  it('should not be able to change the responsible of a ticket for an agent that not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
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
      changeResponsible.execute({
        agent_id: 'non-existing-user',
        ticket_id: ticket.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the responsible of a ticket that not exists', async () => {
    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'jonhtre@example.com',
      password: '123456',
      role: 'agent',
    });

    await expect(
      changeResponsible.execute({
        agent_id: agent.id,
        ticket_id: 'non-existing-ticket',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the responsible of a ticket to an user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
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
      changeResponsible.execute({
        agent_id: user.id,
        ticket_id: ticket.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
