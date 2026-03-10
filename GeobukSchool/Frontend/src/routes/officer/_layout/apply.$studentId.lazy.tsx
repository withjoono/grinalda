import { Button } from "@/components/custom/button";
import { EditEvaluationForm } from "@/components/services/evaluation/edit-evaluation-form";
import { springApiClient } from "@/stores/server/api-client";
import { ADDITIONAL_FILE_APIS } from "@/stores/server/features/additional-file/apis";
import { IAdditionalFile } from "@/stores/server/features/additional-file/interfaces";
import { useGetOfficerAdditionalFiles } from "@/stores/server/features/additional-file/queries";
import { useGetEvaluationStudnetInfo } from "@/stores/server/features/spring/queries";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/officer/_layout/apply/$studentId")({
  component: EditEvaluation,
});

function EditEvaluation() {
  const studentId = Route.useParams().studentId;
  const { data: studentInfo } = useGetEvaluationStudnetInfo(studentId);
  const { data: files } = useGetOfficerAdditionalFiles(Number(studentId));

  const downloadPdfAndHtml = () => {
    downloadSchoolrecrodFileFetch(studentId, studentInfo?.studentName);
  };

  // 한글 파일명 디코딩 함수
  const decodeFileName = (fileName: string): string => {
    try {
      return decodeURIComponent(fileName.replace(/\+/g, " "));
    } catch {
      return fileName; // 디코딩 실패 시 원래 파일명 반환
    }
  };

  const handleDownload = async (fileId: number) => {
    try {
      const { url, fileName } =
        await ADDITIONAL_FILE_APIS.getOfficerAdditionalFileDownloadUrlAPI(
          fileId,
        );

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank"; // 새 탭에서 열기
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("파일 다운로드 중 오류가 발생했습니다.");
      console.error("Download error:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 pb-8">
        <Button onClick={downloadPdfAndHtml} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          생기부 다운로드
        </Button>
        <div className="">
          <h3 className="text-md mb-2 font-semibold">업로드된 파일 목록</h3>
          {files && files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file: IAdditionalFile) => (
                <li key={file.id} className="flex items-center justify-between">
                  <span>{decodeFileName(file.file_name)}</span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDownload(file.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-accent-foreground">추가 파일 없음</p>
          )}
        </div>
      </div>
      <EditEvaluationForm studentId={studentId} />
    </div>
  );
}

/**
 * 평가자 -> 학생 파일 다운로드
 */
const downloadSchoolrecrodFileFetch = async (
  studentId: string | undefined,
  studentName: string | undefined,
) => {
  await springApiClient
    .post(
      "/officer/file/list",
      {
        studentId: studentId,
      },
      {
        responseType: "blob",
      },
    )
    .then((res) => {
      const url = URL.createObjectURL(res.data);
      console.log(res);
      const link = document.createElement("a");
      link.href = url;
      link.download = studentName + "_생활기록부.zip";
      link.click();
    });
};
