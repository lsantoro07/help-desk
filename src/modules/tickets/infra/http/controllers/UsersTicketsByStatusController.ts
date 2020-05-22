import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListTicketsByStatusService from '@modules/tickets/services/ListAllUsersTicketsByStatusService';

export default class UsersTicketsByStatusController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { status } = request.params;

    const listTickets = container.resolve(ListTicketsByStatusService);

    const tickets = await listTickets.execute({
      status,
      user_id,
    });

    return response.json(tickets);
  }
}
