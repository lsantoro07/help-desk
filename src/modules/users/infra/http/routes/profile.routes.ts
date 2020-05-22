import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ProfileController from '../controllers/ProfileController';
import UserAvatarController from '../controllers/UserAvatarController';
import ensureAuth from '../middlewares/ensureAuth';

const upload = multer(uploadConfig.multer);
const updateAvatar = new UserAvatarController();

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuth);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

profileRouter.patch('/avatar', upload.single('avatar'), updateAvatar.update);

export default profileRouter;
