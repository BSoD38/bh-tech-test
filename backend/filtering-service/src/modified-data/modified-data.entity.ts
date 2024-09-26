import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  // I don't really like this, I can't access the User entity from here...
  // So I can't really create a relation
  @Column()
  modifiedBy: number;

  @Column({ type: 'smallint' })
  oldValue: number;

  @Column({ type: 'smallint' })
  newValue: number;

  @UpdateDateColumn()
  modifiedAt: Date;
}
