import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer/mailer.service';
import { TokenModule } from './token/token.module';
import { AuthorizationMiddleware } from './common/middlewares/authorization.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    MailerModule,
    TokenModule,
    JwtModule
  ],
  providers: [MailerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).exclude('/auth/signup','/auth/signin','auth/verify-email','auth/refresh-token').forRoutes('*');
  }
}
