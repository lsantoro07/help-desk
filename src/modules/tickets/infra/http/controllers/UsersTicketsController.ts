import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAllUsersTicketsService from '@modules/tickets/services/ListAllUsersTicketsService';

export default class UsersTicketsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listTickets = container.resolve(ListAllUsersTicketsService);

    const tickets = await listTickets.execute({
      user_id: id,
    });

    return response.json(tickets);
  }
}
