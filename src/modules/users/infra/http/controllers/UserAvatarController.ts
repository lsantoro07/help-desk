import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdatAvatarUserService from '@modules/users/services/UpdateAvatarUserService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUser = container.resolve(UpdatAvatarUserService);

    const user = await updateAvatarUser.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
}
