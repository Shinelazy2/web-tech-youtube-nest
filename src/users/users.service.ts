import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  signup(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const user = new User();
    user.password = hash;
    user.username = username;
    user.salt = salt;
    user.role = role;

    return this.usersRepository.save(user);
  }

  async signin(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const userResult = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      // .andWhere("user.password = :password", { password: password})
      .getOne();

    console.log('userResult : ', userResult);
    const { salt } = userResult;

    const hash = bcrypt.hashSync(password, salt);
    const signInResult = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .andWhere('user.password = :password', { password: hash })
      .getOne();
    return signInResult;
  }

  async findIdx(user_idx: number): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.user_idx = :user_idx', { user_idx: user_idx })
      // .andWhere("user.password = :password", { password: password})
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .getMany();
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    const { user_idx, username, password } = updateUserDto;

    const userResult = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.user_idx = :user_idx', { user_idx: user_idx })
      // .andWhere("user.password = :password", { password: password})
      .getOne();
    const { salt } = userResult;
    console.log(userResult);
    const hash = bcrypt.hashSync(password, salt);

    return await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({ username: username, password: hash })
      .where('user_idx = :user_idx', { user_idx: user_idx })
      .execute();
  }

  async remove(user_idx: number): Promise<DeleteResult> {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('user_idx = :user_idx', { user_idx: user_idx })
      .execute();
  }
}
