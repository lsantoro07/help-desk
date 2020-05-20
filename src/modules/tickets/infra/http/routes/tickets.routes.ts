import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

// import ArticlesTicketController from '../controllers/ArticlesTicketController';
import TicketResponsabilityController from '../controllers/TicketResponsabilityController';
import TicketController from '../controllers/TicketsController';

const ticketsRouter = Router();
const ticketController = new TicketController();
// const articlesTicketController = new ArticlesTicketController();
const ticketResponsabilityController = new TicketResponsabilityController();

ticketsRouter.post('/', ensureAuth, ticketController.create);
ticketsRouter.get('/:ticket_id', ensureAuth, ticketController.show);

// ticketsRouter.post(
//   '/:ticket/article',
//   ensureAuth,
//   articlesTicketController.create,
// );

ticketsRouter.patch(
  '/:ticket_id/responsabile',
  ensureAuth,
  ticketResponsabilityController.update,
);

export default ticketsRouter;
