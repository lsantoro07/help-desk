import ICreateArticlesTicketDTO from '@modules/tickets/dtos/ICreateArticlesTicketDTO';
import IArticlesTicketRepository from '@modules/tickets/repositories/IArticlesTicketRepository';

import Article from '../../entities/Article';

class ArticlesTicketRepository implements IArticlesTicketRepository {
  private articles: Article[] = [];

  public async create(articleData: ICreateArticlesTicketDTO): Promise<Article> {
    const article = new Article();

    Object.assign(article, articleData);
    this.articles.push(article);

    return article;
  }
}

export default ArticlesTicketRepository;
