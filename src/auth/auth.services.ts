import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailerService } from 'src/mailer/mailer.service';
import * as otpGenrator from 'otp-generator';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}
  async login(user: AuthDto) {
    try {
      const User = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!User.status) {
        throw new HttpException('User not verified please verify mail', HttpStatus.FORBIDDEN);
      }
      
      return User;
    } catch (error) {
      return error
    }
  }
  async signup(user: AuthDto) {
    try {
      const password = await argon.hash(user.password);
      const Otp: string = await otpGenrator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const text: string = `${Otp} is the otp for verifying your application, otp expired within 10 minute`;
      const today: Date = new Date();
      const otpExpiredDate: Date = new Date(today.getTime() + 10 * 60 * 1000);
      await this.mailer.sendEmail({
        recipients: [user.email],
        subject: 'Verification Mail',
        text: text,
        html: '',
      });
      await this.prisma.user.create({
        data: {
          email: user.email,
          password,
          otp: Otp,
          otpExpired: otpExpiredDate,
        },
      });
      return 'User created successfully';
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already taken');
        }
      }
      throw error;
    }
  }
}
