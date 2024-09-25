import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RawData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  value: number;

  @Column({ type: 'timestamp' })
  date: Date;
}
