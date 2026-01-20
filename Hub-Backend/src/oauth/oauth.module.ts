import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthClientEntity } from '../database/entities/oauth/oauth-client.entity';
import { OAuthAuthorizationCodeEntity } from '../database/entities/oauth/oauth-authorization-code.entity';
import { JwtModule } from '../common/jwt/jwt.module';
import { MembersModule } from '../modules/members/members.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OAuthClientEntity, OAuthAuthorizationCodeEntity]),
    JwtModule,
    MembersModule,
    AuthModule, // CookieService를 위해 추가
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
