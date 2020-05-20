import ICreateTicketDTO from '../dtos/ICreateTicketDTO';
import Ticket from '../infra/typeorm/entities/Ticket';

export default interface ITicketsRepository {
  create(data: ICreateTicketDTO): Promise<Ticket>;
  findTicketById(ticket_id: string): Promise<Ticket | undefined>;
  save(ticket: Ticket): Promise<Ticket>;
}
