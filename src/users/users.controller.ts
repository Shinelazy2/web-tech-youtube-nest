import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DeleteResult } from 'typeorm';
// import { ParseIntPipe } from './common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from './interfaces/user.interface';
import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.signup(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.signin(createUserDto);
    console.log('user : ', user);
    return this.authService.login(user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getList(): Promise<User[]> {
    // get by ID logic
    console.log('get user list');
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':user_idx')
  findIdx(
    @Param(
      'user_idx',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    user_idx: number,
  ): Promise<User> {
    console.log('id : ', user_idx);
    // get by ID logic
    return this.usersService.findIdx(user_idx);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Patch()
  editUser(@Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.usersService.updateUser(updateUserDto);
  }

  @Delete(':user_idx')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(
    @Param('user_idx', new ParseIntPipe()) user_idx: number,
  ): Promise<DeleteResult> {
    console.log('id : ', user_idx);
    // get by ID logic
    return this.usersService.remove(user_idx);
  }
}
