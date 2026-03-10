import { useAuthStore } from "@/stores/client/use-auth-store";
import {
  useGetCurrentUser,
  useGetSchoolRecords,
} from "@/stores/server/features/me/queries";
import { SPRING_API } from "@/stores/server/features/spring/apis";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useLifeRecordUpload = () => {
  const [canUpload, setCanUpload] = useState(true);
  const { data: currentUser } = useGetCurrentUser();
  const { refetch: refetchSchoolRecord } = useGetSchoolRecords();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Zustand
  const { clearTokens } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    queryClient.clear();
    toast.success("토큰이 만료되어 로그아웃됩니다.");
    navigate({ to: "/auth/login" });
  };

  useEffect(() => {
    _checkCanUpload();
  }, [currentUser]);

  const _checkCanUpload = async () => {
    if (!currentUser) return;
    try {
      const { status: pdfUploaded } =
        await SPRING_API.checkEarlydStudentSchoolRecordFileUpload(
          "GRADUATEPDF",
        );
      const { status: htmlUploaded } =
        await SPRING_API.checkEarlydStudentSchoolRecordFileUpload(
          "THREEGRADEHTML",
        );

      // 둘중 하나라도 업로드 된 상태면 업로드 불가능
      if (pdfUploaded && htmlUploaded) {
        setCanUpload(true);
      } else {
        setCanUpload(false);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
        handleLogout();
      }
    }
  };

  const uploadFile = async (type: "html" | "pdf", file: File) => {
    if (!currentUser) return;
    try {
      if (type === "html") {
        const res = await SPRING_API.uploadEarlyThreeGradeHtmlFile(file);
        if (res.status) {
          setCanUpload(false);
          toast.success("생활기록부(html) 업로드에 성공하였습니다.");
          await refetchSchoolRecord();
        } else {
          toast.error(
            "생활기록부(html) 업로드에 실패했습니다. 잠시후 다시 시도해주세요.",
          );
        }
      } else if (type === "pdf") {
        const res = await SPRING_API.uploadEarlyThreeGradeGraduatePdfFile(file);

        if (res.status) {
          setCanUpload(false);
          toast.success("생활기록부(pdf) 업로드에 성공하였습니다.");
          await refetchSchoolRecord();
        } else {
          toast.error(
            "생활기록부(pdf) 업로드에 실패했습니다. 잠시후 다시 시도해주세요.",
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { canUpload, uploadFile };
};
