import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from './authorization.middleware';

@Global()
@Module({
  imports: [JwtModule],
  providers: [AuthorizationMiddleware],
  exports: [AuthorizationMiddleware],
})
export class AuthModule {}
