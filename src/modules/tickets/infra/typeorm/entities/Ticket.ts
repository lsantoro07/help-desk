import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Article from '@modules/tickets/infra/typeorm/entities/Article';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('tickets')
class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: 'open' | 'pending user' | 'pending responsible' | 'closed';

  @Column()
  title: string;

  @ManyToOne(() => User, user => user.tickets_owner, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, user => user.tickets_responsible, { eager: true })
  @JoinColumn({ name: 'responsible_user_id' })
  responsible: User;

  @OneToMany(() => Article, article => article.ticket, {
    cascade: true,
    eager: true,
  })
  articles: Article[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp with time zone')
  closed_at: Date;
}

export default Ticket;
