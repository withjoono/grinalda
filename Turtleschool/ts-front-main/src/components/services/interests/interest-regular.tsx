import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/custom/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import UnknownErrorPage from "@/components/errors/unknown-error";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetInterestRegularAdmissions } from "@/stores/server/features/jungsi/queries";
import { useRemoveInterestRegularAdmission } from "@/stores/server/features/jungsi/mutations";
import {
  InterestRegularTable,
  ProcessedAdmission,
} from "./interest-regular-table";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { IRegularAdmission } from "@/stores/server/features/jungsi/interfaces";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";
import { calc정시유불리 } from "@/lib/calculations/regular-v2/advantage";

type InterestRegularProps = {
  onClickRegularDetail: (regularAdmissionId: number) => void;
  className?: string;
  isCreatingCombination: boolean;
  selectedItems: IRegularAdmission[];
  toggleItemSelection: (item: IRegularAdmission) => void;
  admissionType: "가" | "나" | "다";
};

export const InterestRegular = React.memo(
  ({
    onClickRegularDetail,
    className,
    isCreatingCombination,
    selectedItems,
    toggleItemSelection,
    admissionType,
  }: InterestRegularProps) => {
    const {
      data: interestUnits,
      refetch: refetchInterestUnits,
      status: interestUnitsStatus,
    } = useGetInterestRegularAdmissions(admissionType);

    const removeInterestUniv = useRemoveInterestRegularAdmission();
    const { data: mockExamScores } = useGetMockExamStandardScores();

    const [processedAdmissions, setProcessedAdmissions] = useState<
      ProcessedAdmission[]
    >([]);

    useEffect(() => {
      const processAdmissions = async () => {
        if (!interestUnits || !mockExamScores) return;

        const processed: ProcessedAdmission[] = [];

        for (const admission of interestUnits) {
          const params = prepare정시환산점수(mockExamScores.data, {
            score_calculation: admission.score_calculation || "",
            major:
              mockExamScores.academic_division === "NaturalSciences"
                ? "이과"
                : "문과",
          });
          const calculatedScore = await calc정시환산점수(params);

          if (calculatedScore.success && calculatedScore.내점수 !== undefined) {
            const myScore = calculatedScore.내점수;
            const risk = calc정시위험도(myScore, {
              risk_10: parseFloat(admission.risk_plus_5 || "0"),
              risk_9: parseFloat(admission.risk_plus_4 || "0"),
              risk_8: parseFloat(admission.risk_plus_3 || "0"),
              risk_7: parseFloat(admission.risk_plus_2 || "0"),
              risk_6: parseFloat(admission.risk_plus_1 || "0"),
              risk_5: parseFloat(admission.risk_minus_1 || "0"),
              risk_4: parseFloat(admission.risk_minus_2 || "0"),
              risk_3: parseFloat(admission.risk_minus_3 || "0"),
              risk_2: parseFloat(admission.risk_minus_4 || "0"),
              risk_1: parseFloat(admission.risk_minus_5 || "0"),
            });
            const standardScore = await calc정시유불리({
              학교: admission.score_calculation || "",
              표점합: calculatedScore.표점합 || 0,
            });

            const scoreDifference = myScore - (standardScore.점수 || 0);
            const normalizedScoreDifference =
              (scoreDifference / (admission.total_score || 1000)) * 1000;

            processed.push({
              ...admission,
              myScore,
              risk,
              standardScore: standardScore.점수 || 0,
              scoreDifference,
              normalizedScoreDifference,
            });
          } else {
            processed.push({
              ...admission,
              errorMessage: calculatedScore.result || "계산 오류",
            });
          }
        }

        setProcessedAdmissions(processed);
      };

      processAdmissions();
    }, [interestUnits, mockExamScores]);

    const removeItem = useCallback(
      async (ids: number[]) => {
        if (!interestUnits) return;
        const result = await removeInterestUniv.mutateAsync({
          targetIds: ids,
          admissionType: admissionType,
        });
        if (result.success) {
          await refetchInterestUnits();
          toast.success(`성공적으로 대학을 삭제했습니다.`);
        } else {
          toast.error(result.error);
        }
      },
      [interestUnits, removeInterestUniv, refetchInterestUnits, admissionType],
    );

    const removeAllItems = useCallback(async () => {
      if (!interestUnits) return;
      const result = await removeInterestUniv.mutateAsync({
        targetIds: interestUnits.map((item) => item.id),
        admissionType: admissionType,
      });
      if (result.success) {
        await refetchInterestUnits();
        toast.success(`성공적으로 모든 대학을 삭제했습니다.`);
      } else {
        toast.error(result.error);
      }
    }, [
      interestUnits,
      removeInterestUniv,
      refetchInterestUnits,
      admissionType,
    ]);

    if (interestUnitsStatus === "pending") {
      return <LoadingSpinner />;
    }

    if (interestUnitsStatus === "error") {
      return <UnknownErrorPage />;
    }

    if (processedAdmissions.length === 0) {
      return (
        <div className="flex w-full flex-col items-center justify-center space-y-2 py-20">
          <p className="text-base font-semibold sm:text-lg">
            관심대학으로 선택된 대학 목록이 비어있어요 🥲
          </p>
          <p className="text-sm text-foreground/70">
            <Link
              to={`/jungsi/${admissionType === "가" ? "a" : admissionType === "나" ? "b" : "c"}`}
              className="text-blue-500"
            >
              {admissionType}군 탐색
            </Link>
            에서 대학을 탐색해서 관심목록에 담아보세요!
          </p>
        </div>
      );
    }

    return (
      <div className={cn("", className)}>
        <div className="flex items-center justify-end pb-2">
          {!isCreatingCombination && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  variant={"destructive"}
                >
                  <Trash className="size-4" />
                  전체삭제({processedAdmissions.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
                  <AlertDialogDescription>
                    관심대학으로 선택된 모든 대학 목록(교과)이 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={removeAllItems}>
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <InterestRegularTable
          data={processedAdmissions}
          removeItem={removeItem}
          isCreatingCombination={isCreatingCombination}
          selectedItems={selectedItems}
          toggleItemSelection={toggleItemSelection}
          onClickRegularDetail={onClickRegularDetail}
          admissionType={admissionType}
        />
      </div>
    );
  },
);
