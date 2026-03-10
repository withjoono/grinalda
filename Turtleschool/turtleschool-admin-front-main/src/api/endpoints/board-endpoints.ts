import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';
import { IBoardPostData } from '../types/board-types';

export const boardEndpoints = {
  getPostsByBoard: async (
    boardId: number,
    page: number,
    limit: number
  ): Promise<
    IBaseAPIResponse<{
      posts: IBoardPostData[];
      total: number;
      page: number;
      limit: number;
    }>
  > => {
    try {
      const response = await nestApiClient.get<
        ISuccessResponse<{
          posts: IBoardPostData[];
          total: number;
          page: number;
          limit: number;
        }>
      >(`/boards/${boardId}/posts`, {
        params: {
          page: page || 1,
          limit: limit || 15,
        },
      });
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  getPostById: async (
    boardId: string,
    postId: string
  ): Promise<IBaseAPIResponse<IBoardPostData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IBoardPostData>>(
        `/boards/${boardId}/posts/${postId}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  createPost: async ({
    boardId,
    title,
    content,
    is_emphasized,
  }: {
    boardId: string;
    title: string;
    content: string;
    is_emphasized: boolean;
  }): Promise<IBaseAPIResponse<IBoardPostData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IBoardPostData>>(
        `/boards/${boardId}/posts`,
        { title, content, is_emphasized }
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  editPost: async ({
    boardId,
    postId,
    title,
    content,
    is_emphasized,
  }: {
    boardId: string;
    postId: string;
    title: string;
    content: string;
    is_emphasized: boolean;
  }): Promise<IBaseAPIResponse<IBoardPostData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IBoardPostData>>(
        `/boards/${boardId}/posts/${postId}`,
        { title, content, is_emphasized }
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  deletePost: async ({
    boardId,
    postId,
  }: {
    boardId: number;
    postId: number;
  }): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/boards/${boardId}/posts/${postId}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
