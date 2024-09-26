import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { RawData } from '../raw-data/raw-data.entity';
import { FilteredData } from '../filtered-data/filtered-data.entity';

@Entity()
export class ModifiedData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RawData)
  @JoinColumn()
  rawData: RawData;

  @OneToOne(() => FilteredData)
  @JoinColumn()
  filteredData: FilteredData;

  // Hmmm, I don't really like this, I can't access the User entity from here...
  @OneToOne('user')
  @JoinColumn()
  modifiedBy: number;

  @Column({ type: 'smallint' })
  oldValue: number;

  @Column({ type: 'smallint' })
  newValue: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}
