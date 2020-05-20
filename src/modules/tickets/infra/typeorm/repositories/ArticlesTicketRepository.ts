import { getRepository, Repository } from 'typeorm';

import ICreateArticlesTicketDTO from '@modules/tickets/dtos/ICreateArticlesTicketDTO';
import IArticlesTicketRepository from '@modules/tickets/repositories/IArticlesTicketRepository';

import Article from '../entities/Article';

class ArticlesTicketRepository implements IArticlesTicketRepository {
  private ormRepository: Repository<Article>;

  constructor() {
    this.ormRepository = getRepository(Article);
  }

  public async create({
    user_id,
    ticket_id,
    description,
  }: ICreateArticlesTicketDTO): Promise<Article> {
    const article = this.ormRepository.create({
      user_id,
      ticket_id,
      description,
    });

    await this.ormRepository.save(article);

    return article;
  }
}

export default ArticlesTicketRepository;
