import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RawData } from '../raw-data/raw-data.entity';

@Entity()
export class FilteredData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RawData)
  @JoinColumn()
  rawData: RawData;

  @Column({ type: 'smallint' })
  value: number;

  @Column({ type: 'timestamp' })
  date: Date;
}
