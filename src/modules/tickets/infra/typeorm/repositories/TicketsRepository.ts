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
}

export default TicketRepository;
