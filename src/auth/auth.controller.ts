import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto, EmailAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signin(@Body() user:AuthDto){    
    return this.authService.signin(user)
  }
  @Post('signup')
  signup(@Body() user:AuthDto){
    return this.authService.signup(user)
  }
  @Post('verify-email')
  verifyEmail(@Body() creadentials:EmailAuthDto){
    return this.authService.verifyEmail(creadentials)
  }
}
