import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.services';
import { MailerModule } from 'src/mailer/mailer.module';
import { TokenModule } from 'src/token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MailerModule,JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
