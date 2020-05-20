import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import ensureAuth from '../middlewares/ensureAuth';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  usersController.create,
);

usersRouter.get('/', ensureAuth, usersController.index);

usersRouter.patch('/:id/role', ensureAuth, usersController.update);

usersRouter.delete('/:user_id', ensureAuth, usersController.delete);

export default usersRouter;
