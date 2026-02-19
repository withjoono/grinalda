import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CommonSearchQueryDto } from 'src/common/dtos/common-search-query.dto';
import { AdminMemberResponseDto } from '../dtos/admin-member-repsonse.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminMemberService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getAllMembers(commonSearchQueryDto: CommonSearchQueryDto): Promise<AdminMemberResponseDto> {
    const { page = 1, pageSize = 10, searchWord, searchField, sortField, sortDirection } = commonSearchQueryDto as any;

    const where: Prisma.AuthMemberWhereInput = {};
    if (searchWord && searchField) {
      where[searchField] = { contains: searchWord, mode: 'insensitive' };
    }

    const orderBy: Record<string, string> = {};
    if (sortField) {
      orderBy[sortField] = sortDirection || 'asc';
    }

    const [list, totalCount] = await Promise.all([
      this.prisma.authMember.findMany({
        where,
        orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.authMember.count({ where }),
    ]);

    return { list, totalCount };
  }
}
