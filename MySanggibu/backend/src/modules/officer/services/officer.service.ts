// @ts-nocheck
import { OfficerTicketEntity } from '../../../database/entities/officer-evaluation/officer-ticket.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SmsService } from '../../sms/sms.service';
import { UpdateOfficerProfileResponseDto } from '../dtos/update-officer-profile.dto';

@Injectable()
export class OfficerService {
  private readonly logger = new Logger(OfficerService.name);
  constructor(
    private readonly prisma: PrismaService,
    private smsService: SmsService,
  ) { }

  /**
   * 사정관인지 체크
   */
  async checkOfficer(memberId: string): Promise<boolean> {
    const officer = await this.officerRepository.findOne({
      where: {
        member_id: memberId,
      },
    });

    if (officer) {
      return true;
    }
    return false;
  }

  async getOfficerProfile(memberId: string): Promise<OfficerListEntity> {
    const officer = await this.officerRepository.findOne({
      where: {
        member_id: memberId,
      },
    });

    if (!officer) {
      throw new BadRequestException('사정관이 아닙니다.');
    }

    return officer;
  }

  async updateOfficerProfile(
    memberId: string,
    data: UpdateOfficerProfileResponseDto,
  ): Promise<OfficerListEntity> {
    const officer = await this.officerRepository.findOne({
      where: {
        member_id: memberId,
      },
    });

    if (!officer) {
      throw new BadRequestException('사정관이 아닙니다.');
    }

    if (data.name) {
      officer.officer_name = data.name;
    }
    if (data.university) {
      officer.university = data.university;
    }
    if (data.education) {
      officer.education = data.education;
    }
    await this.officerRepository.save(officer);
    return officer;
  }
}
