import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import ArticlesTicketRepository from '@modules/tickets/infra/typeorm/repositories/ArticlesTicketRepository';
import TicketsRepository from '@modules/tickets/infra/typeorm/repositories/TicketsRepository';
import IArticlesTicketRepository from '@modules/tickets/repositories/IArticlesTicketRepository';
import ITicketsRepository from '@modules/tickets/repositories/ITicketsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UsersTokensRepository from '@modules/users/infra/typeorm/repositories/UsersTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';

container.registerSingleton<ITicketsRepository>(
  'TicketsRepository',
  TicketsRepository,
);

container.registerSingleton<IArticlesTicketRepository>(
  'ArticlesTicketRepository',
  ArticlesTicketRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository,
);
