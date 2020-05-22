import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';

import FakeArticlesTicketRepository from '../infra/typeorm/repositories/fakes/FakeArticlesTicketRepository';
import FakeTicketRepository from '../infra/typeorm/repositories/fakes/FakeTicketsRepository';
import CreateTicketArticleService from './CreateTicketArticleService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTicketRepository: FakeTicketRepository;
let fakeArticleTicketRepository: FakeArticlesTicketRepository;
let fakeMailProvider: FakeMailProvider;
let createArticle: CreateTicketArticleService;
describe('CreateArticle', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTicketRepository = new FakeTicketRepository();
    fakeArticleTicketRepository = new FakeArticlesTicketRepository();
    fakeMailProvider = new FakeMailProvider();
    createArticle = new CreateTicketArticleService(
      fakeTicketRepository,
      fakeUsersRepository,
      fakeArticleTicketRepository,
      fakeMailProvider,
    );
  });

  it('should be able to create an article to a ticket', async () => {
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

    const article = await createArticle.execute({
      user_id: user.id,
      ticket_id: ticket.id,
      description: 'New article',
    });

    expect(article).toHaveProperty('id');
  });

  it('should not be able to create an article to a ticket with an user that not exists', async () => {
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
      createArticle.execute({
        user_id: 'non-existing-user',
        ticket_id: ticket.id,
        description: 'New article',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an article to a ticket that not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    await expect(
      createArticle.execute({
        user_id: user.id,
        ticket_id: 'non-existing-ticket',
        description: 'New article',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an article to a ticket with an user that it is not the owner', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      role: 'user',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
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
      createArticle.execute({
        user_id: user2.id,
        ticket_id: ticket.id,
        description: 'New article',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an article to a ticket with an agent that it is not the responsible', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
      role: 'agent',
    });

    const agent2 = await fakeUsersRepository.create({
      name: 'Jonh Tre',
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

    ticket.responsible = agent;

    await fakeTicketRepository.save(ticket);

    await expect(
      createArticle.execute({
        user_id: agent2.id,
        ticket_id: ticket.id,
        description: 'New article',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able send an email to all agents when an article is created by the user and there is no responsible', async () => {
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

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await createArticle.execute({
      user_id: user.id,
      ticket_id: ticket.id,
      description: 'New article',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should be able send an email to the responsible when an article is created by the user', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
      role: 'agent',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    ticket.responsible = agent;

    await fakeTicketRepository.save(ticket);

    await createArticle.execute({
      user_id: user.id,
      ticket_id: ticket.id,
      description: 'New article',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should be able send an email to the user when an article is created by the responsible', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
      role: 'agent',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    ticket.responsible = agent;

    await fakeTicketRepository.save(ticket);

    await createArticle.execute({
      user_id: agent.id,
      ticket_id: ticket.id,
      description: 'New article',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should be able send an email to the user when an article is created by an agent and the ticket is without responsible', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'user',
    });

    const agent = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
      role: 'agent',
    });

    const ticket = await fakeTicketRepository.create({
      user,
      title: 'New Ticket',
      status: 'open',
      articles: [],
    });

    await createArticle.execute({
      user_id: agent.id,
      ticket_id: ticket.id,
      description: 'New article',
    });

    expect(sendEmail).toHaveBeenCalled();
  });
});
