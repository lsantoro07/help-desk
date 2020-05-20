import { Router } from 'express';

import ticketsRouter from '@modules/tickets/infra/http/routes/tickets.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/tickets', ticketsRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);

export default routes;
