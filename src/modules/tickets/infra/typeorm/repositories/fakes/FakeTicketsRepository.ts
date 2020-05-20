import { uuid } from 'uuidv4';

import ICreateTicketDTO from '@modules/tickets/dtos/ICreateTicketDTO';
import ITicketsRepository from '@modules/tickets/repositories/ITicketsRepository';

import Ticket from '../../entities/Ticket';

class TicketRepository implements ITicketsRepository {
  private tickets: Ticket[] = [];

  public async create(ticketData: ICreateTicketDTO): Promise<Ticket> {
    const ticket = new Ticket();

    Object.assign(ticket, { id: uuid() }, ticketData);

    this.tickets.push(ticket);

    return ticket;
  }

  public async findTicketById(ticket_id: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.find(findTicket => findTicket.id === ticket_id);

    return ticket;
  }

  public async save(ticket: Ticket): Promise<Ticket> {
    const index = this.tickets.findIndex(
      findTicket => findTicket.id === ticket.id,
    );

    this.tickets[index] = ticket;
    return ticket;
  }
}

export default TicketRepository;
