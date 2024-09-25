import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  createUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  updateUser(
    id: number,
    user: User,
    fieldsToUpdate: (keyof User)[],
  ): Promise<User> {
    const userUpdate = { id };
    // Allow partial updates
    for (const field of fieldsToUpdate) {
      userUpdate[field] = user[field];
    }
    return this.usersRepository.save(userUpdate);
  }
}
