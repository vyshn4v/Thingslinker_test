import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto, EmailAuthDto, RefreshTokenDto } from './dto';
import { AuthorizationMiddleware } from 'src/common/middlewares/authorization.middleware';
import { User } from 'src/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('signin')
  signin(@Query() user: AuthDto) {
    return this.authService.signin(user);
  }
  @Post('signup')
  signup(@Body() user: AuthDto) {
    return this.authService.signup(user);
  }
  @Post('verify-email')
  verifyEmail(@Body() creadentials: EmailAuthDto) {
    return this.authService.verifyEmail(creadentials);
  }
  @Post('refresh-token')
  refreshToken(@Headers('authorization') creadentials: string) {
    return this.authService.refreshToken({ refreshToken: creadentials });
  }
}
