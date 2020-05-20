import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  ticket_id: string;
  user_id: string;
}

@injectable()
class ShowTicketInfoService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ ticket_id, user_id }: IRequest): Promise<Ticket> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const ticket = await this.ticketsRepository.findTicketById(ticket_id);

    if (!ticket) {
      throw new AppError('Ticket not found');
    }

    if (user.role === 'user' && ticket.user.id !== user_id) {
      throw new AppError('You do not have permission to view this ticket');
    }

    return ticket;
  }
}

export default ShowTicketInfoService;
