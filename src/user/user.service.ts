import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto, UserDto } from './dto/';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUserDetails(user: UserDto) {
    try {
      const UserDetails = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!UserDetails) {
        throw new NotFoundException('Oops User not exist. Try again');
      }
      const { otp, otpExpired, password, ...rest } = UserDetails;
      return rest;
    } catch (error) {
      return error;
    }
  }

  async updateUserDetails(creadentials: UserDto, userDetails: UpdateUserDto) {
    try {
      if (!userDetails.email && !userDetails.password) {
        throw new BadRequestException('email or password must be required');
      }
      const hashedPassword = await argon.hash(userDetails.password);
      let data: UpdateUserDto = {};
      if (userDetails.email) {
        data.email = userDetails.email;
      }
      if (userDetails.password) {
        data.password = hashedPassword;
      }
      await this.prisma.user.update({
        where: {
          id: creadentials.id,
        },
        data: data,
      });
      return 'User update successfully';
    } catch (error) {
      return error;
    }
  }
}
