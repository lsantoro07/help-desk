import path from 'path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IArticlesTicketRepository from '../repositories/IArticlesTicketRepository';
import ITicketsRepository from '../repositories/ITicketsRepository';

interface IRequest {
  user_id: string;
  ticket_id: string;
  description: string;
}

@injectable()
class CreateTicketArticleService {
  constructor(
    @inject('TicketsRepository') private ticketsRepository: ITicketsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('ArticlesTicketRepository')
    private articleRepository: IArticlesTicketRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
  ) {}

  public async execute({
    user_id,
    ticket_id,
    description,
  }: IRequest): Promise<Article> {
    const ticket = await this.ticketsRepository.findTicketById(ticket_id);

    if (!ticket) {
      throw new AppError('Ticket not found');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.id !== ticket.user.id && user.role === 'user') {
      throw new AppError('You do not have permission to answer this ticket');
    }

    if (
      ticket.responsible &&
      ticket.responsible.id !== user.id &&
      user.id !== ticket.user.id
    ) {
      throw new AppError('You do not have permission to answer this ticket');
    }

    const article = await this.articleRepository.create({
      user_id: user.id,
      ticket_id: ticket.id,
      description,
    });

    const newArticleTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new_article_created.hbs',
    );

    if (user.id === ticket.user.id) {
      if (!ticket.responsible) {
        const agents = await this.usersRepository.findAllAgents();

        if (agents) {
          const mailList = agents.map(agent => agent.email);

          await this.mailProvider.sendMultipleMails({
            to: mailList,
            subject: '[help-desk] Nova resposta em ticket em aberto',
            templateData: {
              file: newArticleTemplate,
              variables: {
                ticket_id: ticket.id,
                description: article.description,
              },
            },
          });
        }
      } else {
        await this.mailProvider.sendMail({
          to: {
            name: ticket.responsible.name,
            email: ticket.responsible.email,
          },
          subject:
            '[help-desk] Nova resposta em ticket sob sua responsabilidade',
          templateData: {
            file: newArticleTemplate,
            variables: {
              ticket_id: ticket.id,
              description: article.description,
            },
          },
        });
      }
    } else if (user.role !== 'user' && !ticket.responsible) {
      await this.mailProvider.sendMail({
        to: { name: ticket.user.name, email: ticket.user.email },
        subject: '[help-desk] Nova resposta no seu ticket',
        templateData: {
          file: newArticleTemplate,
          variables: {
            ticket_id: ticket.id,
            description: article.description,
          },
        },
      });
    } else if (user.id === ticket.responsible.id) {
      await this.mailProvider.sendMail({
        to: { name: ticket.user.name, email: ticket.user.email },
        subject: '[help-desk] Nova resposta no seu ticket',
        templateData: {
          file: newArticleTemplate,
          variables: {
            ticket_id: ticket.id,
            description: article.description,
          },
        },
      });
    }

    return article;
  }
}

export default CreateTicketArticleService;
