import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    try {
      const response = await this.authService.login(req.user);
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.userService.create(createUserDto);
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
