import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { MentoringService } from './mentoring.service';
import { CurrentMemberId } from 'src/auth/decorators/current-member_id.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('mentoring')
export class MentoringController {
    constructor(private readonly mentoringService: MentoringService) { }

    /**
     * 초대 링크 생성
     * POST /mentoring/invite
     * Body: { returnUrl?: string }
     */
    @Post('invite')
    async createInvite(
        @CurrentMemberId() memberId: string,
        @Body() body: { return_url?: string },
    ) {
        try {
            console.log('[Mentoring] createInvite called, memberId:', memberId, typeof memberId);
            return await this.mentoringService.createInvite(memberId, body.return_url);
        } catch (e) {
            console.error('[Mentoring] createInvite error:', e);
            throw e;
        }
    }

    /**
     * 초대 정보 조회 (수락 페이지용 - 비로그인 상태에서도 조회 가능)
     * GET /mentoring/invite/:code
     */
    @Get('invite/:code')
    @Public()
    async getInvite(@Param('code') code: string) {
        return this.mentoringService.getInviteByCode(code);
    }

    /**
     * 초대 수락
     * POST /mentoring/invite/:code/accept
     */
    @Post('invite/:code/accept')
    async acceptInvite(
        @Param('code') code: string,
        @CurrentMemberId() memberId: string,
    ) {
        return this.mentoringService.acceptInvite(code, memberId);
    }

    /**
     * 연동된 계정 목록 조회
     * GET /mentoring/links
     */
    @Get('links')
    async getLinkedAccounts(@CurrentMemberId() memberId: string) {
        return this.mentoringService.getLinkedAccounts(memberId);
    }

    /**
     * 연동 해제
     * DELETE /mentoring/links/:linkId
     */
    @Delete('links/:linkId')
    async unlinkAccount(
        @Param('linkId') linkId: number,
        @CurrentMemberId() memberId: string,
    ) {
        return this.mentoringService.unlinkAccount(linkId, memberId);
    }
}
