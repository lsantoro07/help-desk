import { uuid } from 'uuidv4';

import ICreateArticlesTicketDTO from '@modules/tickets/dtos/ICreateArticlesTicketDTO';
import IArticlesTicketRepository from '@modules/tickets/repositories/IArticlesTicketRepository';

import Article from '../../entities/Article';

class FakeArticlesTicketRepository implements IArticlesTicketRepository {
  private articles: Article[] = [];

  public async create(articleData: ICreateArticlesTicketDTO): Promise<Article> {
    const article = new Article();

    Object.assign(article, { id: uuid() }, articleData);
    this.articles.push(article);

    return article;
  }
}

export default FakeArticlesTicketRepository;
