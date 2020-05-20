import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import Ticket from '@modules/tickets/infra/typeorm/entities/Ticket';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  role: 'user' | 'agent' | 'admin';

  @OneToMany(() => Article, article => article.ticket)
  articles: Article[];

  @OneToMany(() => Ticket, ticket => ticket.user)
  tickets_owner: Ticket[];

  @OneToMany(() => Ticket, ticket => ticket.responsible)
  tickets_responsible: Ticket[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
