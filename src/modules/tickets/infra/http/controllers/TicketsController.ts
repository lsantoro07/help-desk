import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTicketService from '@modules/tickets/services/CreateTicketService';
import ListAllTicketsService from '@modules/tickets/services/ListAllTicketsService';
import ShowTicketInfoService from '@modules/tickets/services/ShowTicketInfoService';

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

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { ticket_id } = request.params;

    const createTicket = container.resolve(ShowTicketInfoService);

    const ticket = await createTicket.execute({
      user_id,
      ticket_id,
    });

    return response.json(ticket);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { role } = request.user;

    const createTicket = container.resolve(ListAllTicketsService);

    const tickets = await createTicket.execute({
      role,
    });

    return response.json(tickets);
  }
}
