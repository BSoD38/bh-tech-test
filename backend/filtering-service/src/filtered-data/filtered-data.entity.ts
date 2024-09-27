import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn, RelationId,
} from 'typeorm';
import { RawData } from '../raw-data/raw-data.entity';

@Entity()
export class FilteredData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RawData)
  @JoinColumn()
  rawData: RawData;

  @Column()
  @RelationId((filteredData: FilteredData) => filteredData.rawData)
  rawDataId: number;

  @Column({ type: 'smallint' })
  value: number;

  @Column({
    type: 'datetime',
    precision: 3,
  })
  date: Date;
}
