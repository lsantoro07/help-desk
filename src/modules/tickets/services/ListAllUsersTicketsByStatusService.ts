import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  user_id: string;
  status: string;
}

@injectable()
class ListTicketsByStatusService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, status }: IRequest): Promise<Ticket[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }
    const tickets = await this.ticketsRepository.findAllUsersTicketsByStatus(
      status,
      user.id,
    );

    return tickets;
  }
}

export default ListTicketsByStatusService;
