import { useState, useEffect, useMemo } from "react";
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
import { Pencil, Eye, Loader2 } from "lucide-react";
import { formatDateYYYYMMDD } from "@/lib/utils/common/date";
import {
  useGetRegularCombinations,
  useGetCalculatedScores,
} from "@/stores/server/features/jungsi/queries";
import {
  IRegularCombination,
  IRegularAdmission,
  ISavedScore,
} from "@/stores/server/features/jungsi/interfaces";
import {
  useDeleteRegularCombination,
  useUpdateRegularCombination,
} from "@/stores/server/features/jungsi/mutations";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { RiskBadge } from "@/components/custom/risk-badge";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";
import { MockApplicationSection } from "@/components/reports/jungsi-report/mock-application-section";

// 군 정렬 순서
const GROUP_ORDER: Record<string, number> = {
  "가": 0,
  "나": 1,
  "다": 2,
};
const getGroupOrder = (type: string) => GROUP_ORDER[type] ?? 3; // 군외는 3

export const Route = createLazyFileRoute("/jungsi/_layout/combination")({
  component: JungsiCombination,
});

function JungsiCombination() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: combinations, refetch: refetchCombinations } =
    useGetRegularCombinations();
  const { data: mockExamScores } = useGetMockExamStandardScores();
  const { data: backendCalculatedScores, isLoading: isLoadingScores } =
    useGetCalculatedScores();

  const [selectedCombination, setSelectedCombination] =
    useState<IRegularCombination | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  // 시뮬레이션 표시용 선택된 모집단위
  const [simulationAdmission, setSimulationAdmission] = useState<IRegularAdmission | null>(null);

  const deleteCombination = useDeleteRegularCombination(
    selectedCombination?.id || 0,
  );
  const updateCombination = useUpdateRegularCombination(
    selectedCombination?.id || 0,
  );

  // 백엔드 calculatedScores를 scoreMap으로 매핑 (scoreCalculationCode 기준)
  const scoreMap = useMemo(() => {
    if (!backendCalculatedScores) return new Map<string, ISavedScore>();

    return new Map(
      backendCalculatedScores.map((score) => [
        `${score.universityId}_${score.scoreCalculationCode}`,
        score,
      ]),
    );
  }, [backendCalculatedScores]);

  // admission별 점수 조회 헬퍼 (scoreCalculationCode 기준)
  const getScoreForAdmission = (admission: IRegularAdmission): number | null => {
    const scoreKey = `${admission.university?.id}_${admission.scoreCalculationCode}`;
    const savedScore = scoreMap.get(scoreKey);
    return savedScore?.convertedScore ?? null;
  };

  const handleSelectCombination = (combination: IRegularCombination) => {
    setSelectedCombination(combination);
    setEditName(combination.name);
    // 조합 변경 시 시뮬레이션 초기화 (useEffect에서 자동 선택됨)
    setSimulationAdmission(null);
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

  // 페이지 로드 시 자동으로 첫 번째 조합 선택
  useEffect(() => {
    if (combinations?.length && !selectedCombination) {
      const firstCombination = combinations[0];
      setSelectedCombination(firstCombination);
      setEditName(firstCombination.name);
    }
  }, [combinations, selectedCombination]);

  // 조합 선택 시 자동으로 첫 번째 가군 시뮬레이션 표시
  useEffect(() => {
    if (selectedCombination && !simulationAdmission) {
      // 가나다군외 순으로 정렬 후 첫 번째 항목 선택
      const sortedAdmissions = [...selectedCombination.regularAdmissions].sort(
        (a, b) => getGroupOrder(a.admissionType) - getGroupOrder(b.admissionType)
      );
      if (sortedAdmissions.length > 0) {
        setSimulationAdmission(sortedAdmissions[0]);
      }
    }
  }, [selectedCombination]);

  // 로딩 중
  if (isLoadingScores) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  (모집단위 {combination.regularAdmissions?.length}개,{" "}
                  {formatDateYYYYMMDD(combination.createdAt)} 생성)
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
                    <TableHead className="min-w-[60px]">군</TableHead>
                    <TableHead className="min-w-[160px]">대학명</TableHead>
                    <TableHead className="min-w-[200px]">모집단위명</TableHead>
                    <TableHead className="min-w-[80px]">유형</TableHead>
                    <TableHead className="min-w-[80px]">총점</TableHead>
                    <TableHead className="min-w-[80px]">최초컷</TableHead>
                    <TableHead className="min-w-[80px]">내 점수</TableHead>
                    <TableHead className="min-w-[100px]">위험도</TableHead>
                    <TableHead className="min-w-[120px]">시뮬레이션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...selectedCombination.regularAdmissions]
                    .sort((a, b) => getGroupOrder(a.admissionType) - getGroupOrder(b.admissionType))
                    .map((admission) => {
                    const score = getScoreForAdmission(admission);
                    const isSimulationSelected = simulationAdmission?.id === admission.id;
                    return (
                      <TableRow
                        key={admission.id}
                        className={isSimulationSelected ? "bg-primary/10" : ""}
                      >
                        <TableCell className="font-medium">
                          {admission.admissionType}군
                        </TableCell>
                        <TableCell>
                          {admission.university?.name} (
                          {admission.university?.region})
                        </TableCell>
                        <TableCell>{admission.admissionName}</TableCell>
                        <TableCell>{admission.generalFieldName}</TableCell>
                        <TableCell>{admission.totalScore}</TableCell>
                        <TableCell>
                          {admission.minCut
                            ? parseFloat(admission.minCut).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {score ? score.toFixed(2) : "-"}
                        </TableCell>
                        <TableCell>
                          {score ? (
                            <RiskBadge
                              risk={calc정시위험도(score, {
                                risk_10: parseFloat(
                                  admission.riskPlus5 || "0",
                                ),
                                risk_9: parseFloat(
                                  admission.riskPlus4 || "0",
                                ),
                                risk_8: parseFloat(
                                  admission.riskPlus3 || "0",
                                ),
                                risk_7: parseFloat(
                                  admission.riskPlus2 || "0",
                                ),
                                risk_6: parseFloat(
                                  admission.riskPlus1 || "0",
                                ),
                                risk_5: parseFloat(
                                  admission.riskMinus1 || "0",
                                ),
                                risk_4: parseFloat(
                                  admission.riskMinus2 || "0",
                                ),
                                risk_3: parseFloat(
                                  admission.riskMinus3 || "0",
                                ),
                                risk_2: parseFloat(
                                  admission.riskMinus4 || "0",
                                ),
                                risk_1: parseFloat(
                                  admission.riskMinus5 || "0",
                                ),
                              })}
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={isSimulationSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSimulationAdmission(
                              isSimulationSelected ? null : admission
                            )}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {isSimulationSelected ? "닫기" : "보기"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* 모의지원 시뮬레이션 안내 - 거북쌤 말풍선 */}
              <div className="mt-4 flex items-start gap-4">
                {/* 거북쌤 이미지 */}
                <div className="flex-shrink-0">
                  <img
                    src="/images/turtle-teacher.png"
                    alt="거북쌤"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                {/* 말풍선 */}
                <div className="relative flex-1 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                  {/* 말풍선 꼬리 */}
                  <div className="absolute left-0 top-6 -translate-x-full">
                    <div className="border-8 border-transparent border-r-blue-200" />
                  </div>
                  <div className="absolute left-0 top-6 -translate-x-[calc(100%-1px)]">
                    <div className="border-8 border-transparent border-r-blue-50" />
                  </div>
                  <p className="font-semibold mb-2">2026 정시 모의지원 시뮬레이션은,</p>
                  <p className="leading-relaxed">
                    '작년 경쟁률' 상황에서, "작년 입결 + 올해 실제 모의지원" 데이터를 기반으로,<br />
                    내 점수로 올해 합격/불합격 가능성과 예상 등수를 알려드립니다.<br /><br />
                    모의지원자 수가 충분히 모이면, 실시간 올해 지원자 데이터로 예측해 드리며,<br />
                    충분히 모이지 않을땐, 작년 입시 결과(입결) 데이터를 기반으로 예측해 드립니다.<br /><br />
                    모의지원 데이터는 '거북스쿨 사용자 + 무료 모의지원 앱 사용자 + 입시 기관 모의지원 현황'을 합쳐서 정리한 데이터입니다.
                  </p>
                </div>
              </div>

              {/* 선택된 대학/학과 시뮬레이션 */}
              {simulationAdmission && (
                <div className="mt-6 rounded-lg border bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-semibold">
                      {simulationAdmission.university?.name} - {simulationAdmission.recruitmentName || simulationAdmission.admissionName} 모의지원 시뮬레이션
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSimulationAdmission(null)}
                    >
                      닫기
                    </Button>
                  </div>
                  <MockApplicationSection
                    universityCode={simulationAdmission.university?.code || ""}
                    universityName={simulationAdmission.university?.name || ""}
                    recruitmentUnit={simulationAdmission.recruitmentName || ""}
                    admissionType={simulationAdmission.admissionType}
                    myScore={getScoreForAdmission(simulationAdmission) ?? undefined}
                  />
                </div>
              )}
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
