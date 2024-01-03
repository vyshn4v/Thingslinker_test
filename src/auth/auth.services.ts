import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, EmailAuthDto, RefreshTokenDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailerService } from 'src/mailer/mailer.service';
import * as otpGenrator from 'otp-generator';
import { TokenService } from 'src/token/token.service';
import { TokensDto } from 'src/token/dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private jwt: TokenService,
  ) {}

  private async verifyPassword(hashedPassword: string, password: string) {
    return await argon.verify(hashedPassword, password);
  }

  verifyToken() {}
  async signin(creadentials: AuthDto) {
    try {
      const User = await this.prisma.user.findUnique({
        where: {
          email: creadentials.email,
        },
      });
      if (!User) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (!User.status) {
        throw new HttpException(
          'User not verified please verify mail',
          HttpStatus.FORBIDDEN,
        );
      }
      const passwordStatus = await this.verifyPassword(
        User.password,
        creadentials.password,
      );
      if (!passwordStatus) {
        throw new HttpException(
          'Entered password is not correct',
          HttpStatus.FORBIDDEN,
        );
      }
      const token: TokensDto = await this.jwt.createTokens({
        id: User.id,
      });
      return token;
    } catch (error) {
      return error;
    }
  }

  async signup(user: AuthDto) {
    try {
      const password: string = await argon.hash(user.password);
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
      });
      const hashedOtp: string = await argon.hash(Otp);
      await this.prisma.user.create({
        data: {
          email: user.email,
          password,
          otp: hashedOtp,
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

  async verifyEmail(creadentials: EmailAuthDto) {
    try {
      const User = await this.prisma.user.findUnique({
        where: {
          email: creadentials.email,
        },
      });
      let currentDate: Date = new Date();
      let expiryDate: Date = new Date(User.otpExpired);
      if (currentDate > expiryDate) {
        return 'Otp expired';
      }
      if (User.status) {
        return 'User already verified';
      }
      const otpStatus: boolean = await this.verifyPassword(
        User.otp,
        creadentials.otp,
      );
      if (!otpStatus) {
        throw new Error('failed');
      }
      await this.prisma.user.update({
        where: {
          email: User.email,
        },
        data: {
          status: true,
          otp: '',
        },
      });
      return 'Otp verified succesfully';
    } catch (error) {
      return error;
    }
  }
  async refreshToken(creadentials: RefreshTokenDto) {
    try {
      const refreshToken: string = creadentials.refreshToken.split(' ')[1];
      console.log(creadentials);

      const decodedToken = await this.jwt.verifyRefreshToken(refreshToken);
      const Token: string = await this.jwt.createToken(decodedToken.email);
      return { token: Token };
    } catch (error) {
      return error;
    }
  }
}
