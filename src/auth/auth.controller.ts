import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signin(@Body() user:AuthDto){    
    return this.authService.login(user)
  }
  @Post('signup')
  signup(@Body() user:AuthDto){
    return this.authService.signup(user)
  }
}
