import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import TicketsByStatusController from '../controllers/TicketsByStatusController';
import TicketsController from '../controllers/TicketsController';
import UsersTicketsByStatusController from '../controllers/UsersTicketsByStatusController';
import UsersTicketsController from '../controllers/UsersTicketsController';

const dashboardRouter = Router();
const usersTicketsController = new UsersTicketsController();
const ticketsController = new TicketsController();
const ticketsByStatusController = new TicketsByStatusController();
const usersTicketsByStatusController = new UsersTicketsByStatusController();

dashboardRouter.get('/user/tickets', ensureAuth, usersTicketsController.index);
dashboardRouter.get(
  '/user/tickets/:status',
  ensureAuth,
  usersTicketsByStatusController.index,
);

dashboardRouter.get('/agent/tickets', ensureAuth, ticketsController.index);
dashboardRouter.get(
  '/agent/tickets/:status',
  ensureAuth,
  ticketsByStatusController.index,
);

export default dashboardRouter;
