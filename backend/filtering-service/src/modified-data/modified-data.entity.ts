import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn, RelationId,
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

  @Column()
  @RelationId((modifiedData: ModifiedData) => modifiedData.rawData)
  rawDataId: number;

  @OneToOne(() => FilteredData)
  @JoinColumn()
  filteredData: FilteredData;

  @RelationId((modifiedData: ModifiedData) => modifiedData.filteredData)
  filteredDataId: number;

  // I don't really like this, I can't access the User entity from here...
  // So I can't really create a relation
  @Column()
  modifiedBy: number;

  @Column({ type: 'smallint' })
  oldValue: number;

  @Column({ type: 'smallint' })
  newValue: number;

  @Column({
    type: 'datetime',
    precision: 3,
  })
  date: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}
