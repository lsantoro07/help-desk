import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import UsersTicketsByStatusController from '../controllers/UsersTicketsByStatusController';
import UsersTicketsController from '../controllers/UsersTicketsController';

const dashboardRouter = Router();
const usersTicketsController = new UsersTicketsController();
const usersTicketsByStatusController = new UsersTicketsByStatusController();

dashboardRouter.get('/user/tickets', ensureAuth, usersTicketsController.index);
dashboardRouter.get(
  '/user/tickets/:status',
  ensureAuth,
  usersTicketsByStatusController.index,
);

export default dashboardRouter;
