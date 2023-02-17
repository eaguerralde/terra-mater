import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(createUserDto)
    }
    catch (ex) {
      throw new HttpException(`create error: ${ex.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find()
    }
    catch (ex) {
      throw new HttpException(`find error: ${ex.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  public async findOne(id: number): Promise<User> {
    try {
      return this.userRepository.findOneBy({ id });
    }
    catch (ex) {
      throw new HttpException(`findOne error: ${ex.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id)
      throw new Error(`update error: id is empty`);
    try {
      const foundRecord = await this.userRepository.findOneBy({ id });
      if (!foundRecord)
        throw new HttpException(`Error during update, item not found => id: ${id}}`, HttpStatus.BAD_REQUEST);
      return this.userRepository.save(Object.assign(updateUserDto, { id }));
    }
    catch (ex) {
      throw new HttpException(`update error: ${ex.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number): Promise<User> {
    if (!id)
      throw new Error(`delete error: id is empty`);
    try {
      const foundRecord = await this.userRepository.findOneBy({ id });
      if (!foundRecord)
        throw new HttpException(`Error during remove, item not found => id: ${id}`, HttpStatus.BAD_REQUEST);
      return  await this.userRepository.remove(foundRecord);
    }
    catch (ex) {
      throw new HttpException(`delete error: ${ex.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
