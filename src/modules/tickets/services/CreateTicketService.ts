import { inject, injectable } from 'tsyringe';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import User from '@modules/users/infra/typeorm/entities/User';

import IArticlesTicketRepository from '../repositories/IArticlesTicketRepository';
import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  user_id: string;
  title: string;
  article: Article;
}

@injectable()
class CreateTicketService {
  constructor(
    @inject('TicketsRepository')
    private ticketsRepository: ITicketsRepository,
    @inject('ArticlesTicketRepository')
    private articlesRepository: IArticlesTicketRepository,
  ) {}

  public async execute({ user_id, title, article }: IRequest): Promise<Ticket> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);
    const articles: Article[] = [];

    if (!user) {
      throw new AppError('Only authenticated users can open tickets', 401);
    }

    const newArticle = new Article();

    Object.assign(newArticle, { user, description: article.description });

    articles.push(newArticle);

    const ticket = await this.ticketsRepository.create({
      user,
      title,
      status: 'open',
      articles,
    });

    return ticket;
  }
}

export default CreateTicketService;
