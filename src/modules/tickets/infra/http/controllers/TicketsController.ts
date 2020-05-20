import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTicketService from '@modules/tickets/services/CreateTicketService';

export default class TicketsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { title } = request.body;
    const { description } = request.body.article;

    const createTicket = container.resolve(CreateTicketService);

    const ticket = await createTicket.execute({
      user_id,
      title,
      description,
    });

    return response.json(ticket);
  }
}
