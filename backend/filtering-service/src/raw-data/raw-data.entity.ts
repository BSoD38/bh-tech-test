import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RawData {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'smallint' })
  value: number;

  @ApiProperty()
  @Column({
    type: 'datetime',
    precision: 3,
  })
  date: Date;
}
