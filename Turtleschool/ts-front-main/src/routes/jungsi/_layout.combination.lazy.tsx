import { useState, useEffect } from "react";
import { RequireLoginMessage } from "@/components/require-login-message";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
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
import { Button } from "@/components/custom/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { formatDateYYYYMMDD } from "@/lib/utils/common/date";
import { useGetRegularCombinations } from "@/stores/server/features/jungsi/queries";
import { IRegularCombination } from "@/stores/server/features/jungsi/interfaces";
import {
  useDeleteRegularCombination,
  useUpdateRegularCombination,
} from "@/stores/server/features/jungsi/mutations";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { RiskBadge } from "@/components/custom/risk-badge";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";

export const Route = createLazyFileRoute("/jungsi/_layout/combination")({
  component: jungsiCombination,
});

function jungsiCombination() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: combinations, refetch: refetchCombinations } =
    useGetRegularCombinations();
  const { data: mockExamScores } = useGetMockExamStandardScores();
  const [selectedCombination, setSelectedCombination] =
    useState<IRegularCombination | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [calculatedScores, setCalculatedScores] = useState<
    Record<number, { score: number | null; isLoading: boolean }>
  >({});

  const deleteCombination = useDeleteRegularCombination(
    selectedCombination?.id || 0,
  );
  const updateCombination = useUpdateRegularCombination(
    selectedCombination?.id || 0,
  );

  const handleSelectCombination = (combination: IRegularCombination) => {
    setSelectedCombination(combination);
    setEditName(combination.name);
  };

  const handleDeleteCombination = async () => {
    if (!selectedCombination) return;
    try {
      await deleteCombination.mutateAsync();
      toast.success("조합이 성공적으로 삭제되었습니다.");
      setSelectedCombination(null);
      refetchCombinations();
    } catch (error) {
      toast.error("조합 삭제에 실패했습니다.");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEditName = async () => {
    if (!selectedCombination) return;
    try {
      await updateCombination.mutateAsync({ name: editName });
      toast.success("조합 이름이 성공적으로 변경되었습니다.");
      refetchCombinations();
      setIsEditingName(false);
      setSelectedCombination({ ...selectedCombination, name: editName });
    } catch (error) {
      toast.error("조합 이름 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!selectedCombination || !mockExamScores) return;

    const calculateScores = async () => {
      const newScores: Record<
        number,
        { score: number | null; isLoading: boolean }
      > = {};
      for (const admission of selectedCombination.regular_admissions) {
        newScores[admission.id] = { score: null, isLoading: true };
        setCalculatedScores((prev) => ({ ...prev, ...newScores }));

        try {
          const params = prepare정시환산점수(mockExamScores.data, {
            score_calculation: admission.score_calculation || "",
            major:
              mockExamScores.academic_division === "NaturalSciences"
                ? "이과"
                : "문과",
          });
          const result = await calc정시환산점수(params);
          newScores[admission.id] = {
            score: result.success ? result.내점수 || null : null,
            isLoading: false,
          };
        } catch (error) {
          console.error("Error calculating score:", error);
          newScores[admission.id] = { score: null, isLoading: false };
        }
        setCalculatedScores((prev) => ({ ...prev, ...newScores }));
      }
    };

    calculateScores();
  }, [selectedCombination, mockExamScores]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">조합 및 모의지원</h3>
        <p className="text-sm text-muted-foreground">
          생성한 조합 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>
      <Separator />
      {!currentUser ? (
        <RequireLoginMessage />
      ) : combinations?.length ? (
        <>
          <div className="flex flex-wrap gap-2">
            {combinations?.map((combination) => (
              <Button
                key={combination.id}
                onClick={() => handleSelectCombination(combination)}
                className="space-x-1"
                variant={
                  selectedCombination?.id === combination.id
                    ? "default"
                    : "outline"
                }
              >
                <span className="font-semibold">{combination.name}</span>
                <span className="text-xs">
                  (모집단위 {combination.regular_admissions?.length}개,{" "}
                  {formatDateYYYYMMDD(combination.created_at)} 생성)
                </span>
              </Button>
            ))}
          </div>
          {selectedCombination && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleEditName}>저장</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingName(false)}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <h4 className="flex items-center text-lg font-semibold">
                    {selectedCombination.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </h4>
                )}
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      조합 삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>조합 삭제 확인</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 이 조합을 삭제하시겠습니까? 이 작업은 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCombination}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">대학명</TableHead>
                    <TableHead className="min-w-[80px]">유형</TableHead>
                    <TableHead className="min-w-[80px]">전형명</TableHead>
                    <TableHead className="min-w-[200px]">모집단위명</TableHead>
                    <TableHead className="min-w-[100px]">총점</TableHead>
                    <TableHead className="min-w-[100px]">최초컷</TableHead>
                    <TableHead className="min-w-[100px]">내 점수</TableHead>
                    <TableHead className="min-w-[140px]">위험도</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCombination.regular_admissions.map((admission) => {
                    const calculatedScore = calculatedScores[admission.id];
                    return (
                      <TableRow key={admission.id}>
                        <TableCell>
                          {admission.university?.name} (
                          {admission.university?.region})
                        </TableCell>
                        <TableCell>{admission.general_field_name}</TableCell>
                        <TableCell>{admission.admission_type}군</TableCell>
                        <TableCell>{admission.admission_name}</TableCell>
                        <TableCell>{admission.total_score}</TableCell>
                        <TableCell>
                          {admission.min_cut
                            ? parseFloat(admission.min_cut).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {calculatedScore?.isLoading
                            ? "계산 중..."
                            : calculatedScore?.score
                              ? calculatedScore.score.toFixed(2)
                              : "계산 실패"}
                        </TableCell>
                        <TableCell>
                          {calculatedScore?.isLoading ? (
                            "계산 중..."
                          ) : calculatedScore?.score ? (
                            <RiskBadge
                              risk={calc정시위험도(calculatedScore.score, {
                                risk_10: parseFloat(
                                  admission.risk_plus_5 || "0",
                                ),
                                risk_9: parseFloat(
                                  admission.risk_plus_4 || "0",
                                ),
                                risk_8: parseFloat(
                                  admission.risk_plus_3 || "0",
                                ),
                                risk_7: parseFloat(
                                  admission.risk_plus_2 || "0",
                                ),
                                risk_6: parseFloat(
                                  admission.risk_plus_1 || "0",
                                ),
                                risk_5: parseFloat(
                                  admission.risk_minus_1 || "0",
                                ),
                                risk_4: parseFloat(
                                  admission.risk_minus_2 || "0",
                                ),
                                risk_3: parseFloat(
                                  admission.risk_minus_3 || "0",
                                ),
                                risk_2: parseFloat(
                                  admission.risk_minus_4 || "0",
                                ),
                                risk_1: parseFloat(
                                  admission.risk_minus_5 || "0",
                                ),
                              })}
                            />
                          ) : (
                            "계산 실패"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-center space-y-2 py-20">
          <p className="text-base font-semibold sm:text-lg">
            조합이 존재하지 않아요 🥲
          </p>
          <p className="text-sm text-foreground/70">
            <Link to="/jungsi/interest" className="text-blue-500">
              관심대학
            </Link>
            에서 모의지원을 위한 조합을 생성해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
