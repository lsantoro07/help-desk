import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ChangeTicketResponsibleService from '@modules/tickets/services/ChangeTicketResponsibleService';

export default class TicketsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { ticket_id } = request.params;

    const changeResponsible = container.resolve(ChangeTicketResponsibleService);

    const ticket = await changeResponsible.execute({
      agent_id: user_id,
      ticket_id,
    });

    return response.json(ticket);
  }
}
