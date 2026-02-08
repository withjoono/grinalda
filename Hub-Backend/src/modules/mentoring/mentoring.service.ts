import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MentoringInviteEntity } from 'src/database/entities/mentoring/mentoring-invite.entity';
import { MentoringLinkEntity } from 'src/database/entities/mentoring/mentoring-link.entity';
import { MemberEntity } from 'src/database/entities/member/member.entity';

@Injectable()
export class MentoringService {
    constructor(
        @InjectRepository(MentoringInviteEntity)
        private readonly inviteRepo: Repository<MentoringInviteEntity>,
        @InjectRepository(MentoringLinkEntity)
        private readonly linkRepo: Repository<MentoringLinkEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepo: Repository<MemberEntity>,
    ) { }

    /**
     * 초대 링크 생성 (24시간 유효)
     */
    async createInvite(memberId: string, returnUrl?: string) {
        const code = uuidv4();
        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 24);

        const invite = this.inviteRepo.create({
            member_id: memberId,
            code,
            return_url: returnUrl || null,
            status: 'pending',
            expire_at: expireAt,
        });

        await this.inviteRepo.save(invite);

        return {
            code: invite.code,
            expireAt: invite.expire_at,
        };
    }

    /**
     * 초대 정보 조회 (수락 페이지용)
     */
    async getInviteByCode(code: string) {
        const invite = await this.inviteRepo.findOne({
            where: { code },
            relations: ['member'],
        });

        if (!invite) {
            throw new NotFoundException('초대 링크가 유효하지 않습니다.');
        }

        if (invite.status === 'accepted') {
            throw new BadRequestException('이미 수락된 초대입니다.');
        }

        if (invite.status === 'expired' || new Date() > invite.expire_at) {
            // 만료 상태 업데이트
            if (invite.status !== 'expired') {
                invite.status = 'expired';
                await this.inviteRepo.save(invite);
            }
            throw new BadRequestException('초대 링크가 만료되었습니다.');
        }

        return {
            code: invite.code,
            inviter: {
                id: invite.member.id,
                name: invite.member.nickname || '미등록',
                memberType: invite.member.member_type,
            },
            returnUrl: invite.return_url,
            expireAt: invite.expire_at,
        };
    }

    /**
     * 초대 수락 → 양방향 연동 생성
     */
    async acceptInvite(code: string, acceptorId: string) {
        const invite = await this.inviteRepo.findOne({
            where: { code },
        });

        if (!invite) {
            throw new NotFoundException('초대 링크가 유효하지 않습니다.');
        }

        if (invite.status === 'accepted') {
            throw new BadRequestException('이미 수락된 초대입니다.');
        }

        if (invite.status === 'expired' || new Date() > invite.expire_at) {
            throw new BadRequestException('초대 링크가 만료되었습니다.');
        }

        // 자기 자신과 연동 방지
        if (invite.member_id === acceptorId) {
            throw new BadRequestException('자신과 연동하실 수 없습니다.');
        }

        // 이미 연동된 관계 확인
        const existingLink = await this.linkRepo.findOne({
            where: [
                { member_id: invite.member_id, linked_member_id: acceptorId },
                { member_id: acceptorId, linked_member_id: invite.member_id },
            ],
        });

        if (existingLink) {
            throw new ConflictException('이미 연동된 계정입니다.');
        }

        // 연동 관계 생성 (양방향)
        const link = this.linkRepo.create({
            member_id: invite.member_id,
            linked_member_id: acceptorId,
        });
        await this.linkRepo.save(link);

        // 초대 상태 업데이트
        invite.status = 'accepted';
        await this.inviteRepo.save(invite);

        return {
            returnUrl: invite.return_url,
            message: '계정 연동이 완료되었습니다.',
        };
    }

    /**
     * 연동된 계정 목록 조회
     */
    async getLinkedAccounts(memberId: string) {
        const links = await this.linkRepo.find({
            where: [
                { member_id: memberId },
                { linked_member_id: memberId },
            ],
            relations: ['member', 'linked_member'],
        });

        return links.map((link) => {
            const isOwner = link.member_id === memberId;
            const partner = isOwner ? link.linked_member : link.member;
            return {
                linkId: link.id,
                partnerId: partner.id,
                partnerName: partner.nickname || '미등록',
                partnerType: partner.member_type,
                linkedAt: link.created_at,
            };
        });
    }

    /**
     * 연동 해제
     */
    async unlinkAccount(linkId: number, memberId: string) {
        const link = await this.linkRepo.findOne({
            where: { id: linkId },
        });

        if (!link) {
            throw new NotFoundException('연동 정보를 찾을 수 없습니다.');
        }

        if (link.member_id !== memberId && link.linked_member_id !== memberId) {
            throw new BadRequestException('본인의 연동만 해제할 수 있습니다.');
        }

        await this.linkRepo.remove(link);
        return { message: '연동이 해제되었습니다.' };
    }
}
