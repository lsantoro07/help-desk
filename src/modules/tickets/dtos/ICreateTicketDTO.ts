import User from '@modules/users/infra/typeorm/entities/User';

import Article from '../infra/typeorm/entities/Article';

export default interface ICreateTicketDTO {
  user: User;
  title: string;
  status: 'open' | 'pending user' | 'pending responsabile' | 'close';
  articles: Article[];
}
