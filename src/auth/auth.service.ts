import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: {
        firstName: user.first_name,
        lastName: user.last_name,
        admin: user.admin,
        userId: user.user_id,
        createAt: user.created_at,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: {
        firstName: user.first_name,
        lastName: user.last_name,
        admin: user.admin,
        userId: user.user_id,
        createAt: user.created_at,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
