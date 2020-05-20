import { inject, injectable } from 'tsyringe';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IArticlesTicketRepository from '../repositories/IArticlesTicketRepository';
import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  user_id: string;
  ticket_id: string;
  description: string;
}
@injectable()
class CreateTicketArticleService {
  constructor(
    @inject('TicketsRepository')
    private ticketsRepository: ITicketsRepository,
    @inject('ArticlesTicketRepository')
    private articlesRepository: IArticlesTicketRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    ticket_id,
    description,
  }: IRequest): Promise<Article> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can answer tickets', 401);
    }

    const ticketRepository = getRepository(Ticket);

    const ticket = await ticketRepository.findOne(ticket_id);

    if (!ticket) {
      throw new AppError('Ticket not found');
    }

    if (ticket.user_id !== user_id && user.role === 'user') {
      throw new AppError(
        'Only the owner of the ticket or agent users can answer this ticket',
        401,
      );
    }

    const article = await this.articlesRepository.create({
      user_id,
      ticket_id: ticket.id,
      description,
    });

    return article;
  }
}

export default CreateTicketArticleService;
