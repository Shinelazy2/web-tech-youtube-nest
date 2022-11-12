import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // return { user_idx: payload.sub, username: payload.username };
    // const user = await this.usersService.findOne(payload.username);
    const user = await this.usersService.findIdx(payload.sub);
    // return { user_idx: payload.sub, username: payload.username  };
    return {
      user_idx: payload.sub,
      username: payload.username,
      role: user.role,
    };
  }
}
