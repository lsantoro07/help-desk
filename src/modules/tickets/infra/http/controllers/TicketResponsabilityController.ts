import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ChangeTicketResponsableService from '@modules/tickets/services/ChangeTicketResponsableService';

export default class TicketsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { ticket_id } = request.params;

    const changeResponsable = container.resolve(ChangeTicketResponsableService);

    const ticket = await changeResponsable.execute({
      agent_id: user_id,
      ticket_id,
    });

    return response.json(ticket);
  }
}
