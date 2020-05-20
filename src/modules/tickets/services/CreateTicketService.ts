import path from 'path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  user_id: string;
  title: string;
  description: string;
}

@injectable()
class CreateTicketService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
  ) {}

  public async execute({
    user_id,
    title,
    description,
  }: IRequest): Promise<Ticket | undefined> {
    const user = await this.usersRepository.findById(user_id);
    const articles: Article[] = [];

    if (!user) {
      throw new AppError('Only authenticated users can open tickets', 401);
    }

    const newArticle = new Article();

    Object.assign(newArticle, { user, description });

    articles.push(newArticle);

    const ticket = await this.ticketsRepository.create({
      user,
      title,
      status: 'open',
      articles,
    });

    const newTicketTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new_ticket_created.hbs',
    );

    const agents = await this.usersRepository.findAllAgents();

    if (agents) {
      const mailList = agents.map(agent => agent.email);

      await this.mailProvider.sendMultipleMails({
        to: mailList,
        subject: '[help-desk] Novo ticket criado',
        templateData: {
          file: newTicketTemplate,
          variables: {
            user_name: user.name,
            title: ticket.title,
            description: ticket.articles[0].description,
          },
        },
      });
    }

    return ticket;
  }
}

export default CreateTicketService;
