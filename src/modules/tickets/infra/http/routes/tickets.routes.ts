import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import ArticlesTicketController from '../controllers/ArticlesTicketController';
import TicketResponsibilityController from '../controllers/TicketResponsibilityController';
import TicketController from '../controllers/TicketsController';

const ticketsRouter = Router();
const ticketController = new TicketController();
const articlesTicketController = new ArticlesTicketController();
const ticketResponsibilityController = new TicketResponsibilityController();

ticketsRouter.post('/', ensureAuth, ticketController.create);

ticketsRouter.get('/:ticket_id', ensureAuth, ticketController.show);

ticketsRouter.post(
  '/:ticket_id/article',
  ensureAuth,
  articlesTicketController.create,
);

ticketsRouter.patch(
  '/:ticket_id/responsible',
  ensureAuth,
  ticketResponsibilityController.update,
);

export default ticketsRouter;
