import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import ArticlesTicketController from '../controllers/ArticlesTicketController';
import TicketController from '../controllers/TicketsController';

const ticketsRouter = Router();
const ticketController = new TicketController();
const articlesTicketController = new ArticlesTicketController();

ticketsRouter.post('/', ensureAuth, ticketController.create);

ticketsRouter.post(
  '/:ticket/article',
  ensureAuth,
  articlesTicketController.create,
);

export default ticketsRouter;
