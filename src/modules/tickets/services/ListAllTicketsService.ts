import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';

import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  role: string;
}

@injectable()
class ListAllTicketsService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
  ) {}

  public async execute({ role }: IRequest): Promise<Ticket[]> {
    if (role === 'user') {
      throw new AppError('You do not have permission to list all tickets.');
    }

    const tickets = await this.ticketsRepository.findAllTickets();

    return tickets;
  }
}

export default ListAllTicketsService;
