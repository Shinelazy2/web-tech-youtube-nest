import { IsInt, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsInt()
  readonly user_idx: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
