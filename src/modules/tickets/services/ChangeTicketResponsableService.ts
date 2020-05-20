import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  ticket_id: string;
  agent_id: string;
}

@injectable()
class ChangeTicketResponsableService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ ticket_id, agent_id }: IRequest): Promise<Ticket> {
    const agent = await this.usersRepository.findById(agent_id);

    if (!agent) {
      throw new AppError('Agent not found');
    }

    if (agent.role === 'user') {
      throw new AppError('You can not take control of a ticket being an user');
    }

    const ticket = await this.ticketsRepository.findTicketById(ticket_id);

    if (!ticket) {
      throw new AppError('Ticket not found');
    }

    ticket.responsible = agent;

    await this.ticketsRepository.save(ticket);
    return ticket;
  }
}

export default ChangeTicketResponsableService;
