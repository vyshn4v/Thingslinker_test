import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/')
  getUserDetails(@User() user: UserDto) {
    return this.userService.getUserDetails(user);
  }
}
