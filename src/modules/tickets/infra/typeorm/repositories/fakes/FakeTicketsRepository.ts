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

  public async findAllTicketsByUser(user_id: string): Promise<Ticket[]> {
    const tickets = this.tickets.filter(
      findTicket => findTicket.user.id === user_id,
    );

    return tickets;
  }

  public async findAllTickets(): Promise<Ticket[]> {
    return this.tickets;
  }

  public async findAllUsersTicketsByStatus(
    status: string,
    user_id: string,
  ): Promise<Ticket[]> {
    const tickets = this.tickets.filter(
      findTicket =>
        findTicket.status === status && findTicket.user.id === user_id,
    );

    return tickets;
  }

  public async findAllTicketsByStatus(status: string): Promise<Ticket[]> {
    const tickets = this.tickets.filter(
      findTicket => findTicket.status === status,
    );

    return tickets;
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
