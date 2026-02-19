import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePostDto } from './dtos/post.dto';
import { MembersService } from '../members/services/members.service';
import { CreateCommentDto } from './dtos/comment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BoardService {
  constructor(
    private prisma: PrismaService,
    private readonly membersService: MembersService,
  ) { }

  async getAllBoards() {
    return this.prisma.board.findMany();
  }

  async getPostsByBoard(
    boardId: number,
    paginationDto: PaginationDto,
  ) {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    const skip = (paginationDto.page - 1) * paginationDto.limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { board_id: boardId },
        include: {
          member: { select: { id: true, nickname: true } },
          board: { select: { id: true, name: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: paginationDto.limit,
      }),
      this.prisma.post.count({ where: { board_id: boardId } }),
    ]);

    return { posts, total };
  }

  async getEmphasizedPostsByBoard(boardId: number) {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    return this.prisma.post.findMany({
      where: { board_id: boardId, is_emphasized: true },
      include: {
        member: { select: { id: true, nickname: true } },
        board: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPostById(boardId: number, postId: number) {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    const post = await this.prisma.post.findFirst({
      where: { id: postId, board_id: boardId },
      include: {
        member: { select: { id: true, nickname: true } },
        board: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  async createPost(boardId: number, createPostDto: CreatePostDto, memberId: string) {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    const member = await this.membersService.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (board.permission === 'ROLE_ADMIN' && member.role_type !== 'ROLE_ADMIN') {
      throw new ForbiddenException('이 게시판에 글을 작성할 권한이 없습니다.');
    }

    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        is_emphasized: createPostDto.is_emphasized,
        board_id: boardId,
        member_id: memberId,
      },
    });
  }

  async editPost(boardId: number, postId: number, editPostDto: CreatePostDto, memberId: string) {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    const member = await this.membersService.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const post = await this.prisma.post.findFirst({
      where: { id: postId, board_id: boardId },
      include: { member: { select: { id: true, nickname: true } } },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.member.id !== member.id) {
      throw new ForbiddenException('자신의 게시글만 수정할 수 있습니다.');
    }

    if (board.permission === 'ROLE_ADMIN' && member.role_type !== 'ROLE_ADMIN') {
      throw new ForbiddenException('이 게시판에 글을 수정할 권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: editPostDto.title,
        content: editPostDto.content,
        is_emphasized: editPostDto.is_emphasized,
      },
    });
  }

  async deletePost(boardId: number, postId: number, memberId: string): Promise<void> {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }

    const post = await this.prisma.post.findFirst({
      where: { id: postId, board_id: boardId },
      include: { member: true },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const member = await this.membersService.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (post.member.id !== member.id && member.role_type !== 'ROLE_ADMIN') {
      throw new ForbiddenException('이 게시글을 삭제할 권한이 없습니다.');
    }

    await this.prisma.post.delete({ where: { id: postId } });
  }

  async createComment(postId: number, createCommentDto: CreateCommentDto, memberId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const member = await this.membersService.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        post_id: postId,
        member_id: memberId,
      },
    });
  }

  async getCommentsByPost(postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return this.prisma.comment.findMany({
      where: { post_id: postId },
      include: { member: { select: { id: true, nickname: true } } },
      orderBy: { created_at: 'asc' },
    });
  }
}
