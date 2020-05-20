import Article from '@modules/tickets/infra/typeorm/entities/Article';

import ICreateArticlesTicketDTO from '../dtos/ICreateArticlesTicketDTO';

export default interface IArticlesTicketRepository {
  create(data: ICreateArticlesTicketDTO): Promise<Article>;
}
