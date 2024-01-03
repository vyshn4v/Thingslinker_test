import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenDataDto, TokensDto } from './dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async createToken(data: string): Promise<string> {
    const token: string = await this.jwtService.sign({data}, {
      expiresIn: this.configService.get('JWT_EXPIRESIN'),
      secret: this.configService.get('JWT_SECRET'),
    });
    return token;
  }
  async createTokens(data: TokenDataDto): Promise<TokensDto> {
    const token: string = await this.jwtService.sign(data, {
      expiresIn: this.configService.get('JWT_EXPIRESIN'),
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken: string = await this.jwtService.sign(data, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRESIN'),
      secret: this.configService.get('JWT_SECRET'),
    });
    return { token, refreshToken };
  }

  async verifyToken(token: string) {
    const status = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return status;
  }
}
