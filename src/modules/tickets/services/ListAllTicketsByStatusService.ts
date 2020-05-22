import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  role: string;
  status: string;
}

@injectable()
class ListAllTicketsByStatusService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
  ) {}

  public async execute({ role, status }: IRequest): Promise<Ticket[]> {
    if (role === 'user') {
      throw new AppError('You do not have permission to list all tickets.');
    }

    const tickets = await this.ticketsRepository.findAllTicketsByStatus(status);

    return tickets;
  }
}

export default ListAllTicketsByStatusService;
