/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';


export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

   create(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: this.idCounter++,
      ...user,
    };
    this.users.push(newUser);
    return Promise.resolve(newUser); 
  }

findByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.username === username));
  }
  findById(id: number): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return Promise.resolve(user); 
  }
}
