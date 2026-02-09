import { z } from "zod";

export const editProfileFormSchema = z.object({
  nickname: z.string().min(2, "이름은 최소 2자 이상이어야 합니다.").max(12, "이름은 최대 12자 입니다."),
  phone: z.string().optional(),
  // 학생 전용
  school: z.string().optional(),
  schoolLevel: z.string().optional(),
  grade: z.string().optional(),
  // 선생님 전용
  subject: z.string().optional(),
  // 학부모 전용
  parentType: z.string().optional(),
});
