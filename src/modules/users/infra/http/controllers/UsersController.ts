import { plainToClass, classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import UpdateRoleUserService from '@modules/users/services/UpdateRoleUserService';

import User from '../../typeorm/entities/User';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { role: agent_role } = request.user;

    const { id: user_id } = request.params;
    const { role } = request.body;
    const updateRoleUser = container.resolve(UpdateRoleUserService);

    const user = await updateRoleUser.execute({
      user_id,
      role,
      agent_role,
    });

    return response.json(classToClass(user));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute();

    return response.json(plainToClass(User, users));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { role } = request.user;
    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({
      user_id,
      role,
    });

    return response.status(204).json();
  }
}
