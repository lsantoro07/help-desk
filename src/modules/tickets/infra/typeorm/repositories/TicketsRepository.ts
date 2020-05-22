import { getRepository, Repository } from 'typeorm';

import ICreateTicketDTO from '@modules/tickets/dtos/ICreateTicketDTO';
import ITicketsRepository from '@modules/tickets/repositories/ITicketsRepository';

import Ticket from '../entities/Ticket';

class TicketRepository implements ITicketsRepository {
  private ormRepository: Repository<Ticket>;

  constructor() {
    this.ormRepository = getRepository(Ticket);
  }

  public async create({
    user,
    title,
    status,
    articles,
  }: ICreateTicketDTO): Promise<Ticket> {
    const ticket = this.ormRepository.create({ user, title, status, articles });

    await this.ormRepository.save(ticket);

    return ticket;
  }

  public async findTicketById(ticket_id: string): Promise<Ticket | undefined> {
    const ticket = await this.ormRepository.findOne(ticket_id);

    return ticket;
  }

  public async findAllTicketsByUser(user_id: string): Promise<Ticket[]> {
    const tickets = await this.ormRepository.find({
      where: { user_id },
    });

    return tickets;
  }

  public async findAllUsersTicketsByStatus(
    status: string,
    user_id: string,
  ): Promise<Ticket[]> {
    const tickets = await this.ormRepository.find({
      where: { status, user_id },
    });

    return tickets;
  }

  public async save(ticket: Ticket): Promise<Ticket> {
    await this.ormRepository.save(ticket);

    return ticket;
  }
}

export default TicketRepository;
