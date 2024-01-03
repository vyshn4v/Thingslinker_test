import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/decorator/user.decorator';
import { UpdateUserDto, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/')
  getUserDetails(@User() user: UserDto) {
    return this.userService.getUserDetails(user);
  }

  @Put('/')
  updateUserDetails(
    @User() credentials: UserDto,
    @Body() userDetails: UpdateUserDto,
  ) {
    return this.userService.updateUserDetails(credentials, userDetails);
  }
}
