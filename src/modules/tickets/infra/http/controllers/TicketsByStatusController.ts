import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAllTicketsByStatusService from '@modules/tickets/services/ListAllTicketsByStatusService';

export default class TicketsByStatusController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { role } = request.user;
    const { status } = request.params;

    const createTicket = container.resolve(ListAllTicketsByStatusService);

    const tickets = await createTicket.execute({
      role,
      status,
    });

    return response.json(tickets);
  }
}
