import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { JwtModule } from '../common/jwt/jwt.module';
import { MembersModule } from '../modules/members/members.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule,
    MembersModule,
    AuthModule, // CookieService를 위해 추가
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule { }
