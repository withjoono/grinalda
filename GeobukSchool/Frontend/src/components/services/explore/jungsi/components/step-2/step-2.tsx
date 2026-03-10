import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { useExploreJungsiStepper } from "../../context/explore-jungsi-provider";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { useGetRegularAdmissions } from "@/stores/server/features/jungsi/queries";
import { Badge } from "@/components/ui/badge";
import { JungsiStep2Chart } from "./step-2-chart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RegionSelector } from "../step-1/region-selector";
import { IRegion } from "@/types/region.type";
import { Step2DataTable } from "./step-2-data-table";
import { toast } from "sonner";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";

export const JungsiStep2 = () => {
  const { formData, nextStep, prevStep, updateFormData } =
    useExploreJungsiStepper();

  const { data: regularAdmissions } = useGetRegularAdmissions({
    year: 2024,
    admission_type: formData.admissionType,
  });
  const { data: mockExamScores } = useGetMockExamStandardScores();

  const [isSorted, setIsSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmissions, setSelectedAdmissions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userScores, setUserScores] = useState<
    Record<
      number,
      {
        score: number | null;
        error: string | null;
      }
    >
  >({});
  const filteredAdmissions = useMemo(() => {
    if (!regularAdmissions || !searchTerm) return [];
    return regularAdmissions.filter(
      (admission) =>
        admission.recruitment_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        admission.university.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [regularAdmissions, searchTerm]);

  const filteredChartData = useMemo(() => {
    return filteredAdmissions.filter((admission) => {
      const regionMatch =
        formData.region.length === 0 ||
        formData.region.includes(admission.university.region as IRegion);

      return regionMatch;
    });
  }, [filteredAdmissions, formData.region]);

  const uniqueAdmissionNames = useMemo(() => {
    return [
      ...new Set(
        filteredAdmissions.map((admission) => admission.recruitment_name),
      ),
    ];
  }, [filteredAdmissions]);

  useEffect(() => {
    const calculateUserScores = async () => {
      if (!filteredChartData || !mockExamScores) return;

      const scores: Record<
        number,
        {
          score: number | null;
          error: string | null;
        }
      > = {};
      const userMajor =
        mockExamScores.academic_division === "NaturalSciences"
          ? "이과"
          : "문과";

      // ******************** 최초컷과 추합컷이 모두 0인 경우 필터링 (임시) ****************
      const filteredData = filteredChartData.filter((item) => {
        const minCut = parseFloat(item.min_cut || "0");
        const maxCut = parseFloat(item.max_cut || "0");
        return !(minCut === 0 && maxCut === 0);
      });
      // ******************** 최초컷과 추합컷이 모두 0인 경우 필터링 (임시) ****************

      for (const item of filteredData) {
        try {
          const params = prepare정시환산점수(mockExamScores.data, {
            score_calculation: item.score_calculation || "",
            major: userMajor,
          });
          const score = await calc정시환산점수(params);

          //## 새 계산식 테스트
          // const result = await calc정시환산점수(params);

          // console.log(result);

          if (score.success && score.내점수 !== undefined) {
            scores[item.id] = { score: score.내점수, error: null };
          } else {
            scores[item.id] = {
              score: null,
              error: score.result || "알 수 없는 오류",
            };
          }
        } catch (error) {
          console.error("Error calculating score:", error);
        }
      }

      setUserScores(scores);
    };

    calculateUserScores();
  }, [filteredChartData, mockExamScores]);

  const handleSearch = () => {
    if (!searchTerm) {
      toast.info("검색어를 입력해주세요.");
      return;
    }
    setShowResults(true);
  };

  const handleNextClick = () => {
    if (
      formData.step1SelectedIds.length === 0 &&
      selectedAdmissions.length === 0
    ) {
      toast.error("대학별/학과별 검색에서 하나 이상의 전형을 선택해야합니다.");
      return;
    }

    updateFormData("step2SelectedIds", selectedAdmissions);
    nextStep();
  };

  return (
    <div className="space-y-3 px-4 pt-4 md:space-y-6">
      <div className="flex w-full items-center justify-center gap-2 pb-12">
        <Input
          type="text"
          placeholder="학과명 검색 (ex. 간호, 무역)"
          value={searchTerm}
          onChange={(e) => {
            setShowResults(false);
            setSearchTerm(e.target.value);
          }}
          className="w-full max-w-md"
        />
        <Button className="" type="button" onClick={handleSearch}>
          검색하기
        </Button>
      </div>

      {searchTerm && !showResults && (
        <div className="space-y-2">
          <p className="text-center text-lg font-semibold">
            검색 할 학과 (총 {uniqueAdmissionNames.length}개)
          </p>
          <div className="mb-4 flex flex-wrap justify-center gap-2 text-sm">
            {uniqueAdmissionNames.map((item) => (
              <Badge
                key={item}
                onClick={() => setSearchTerm(item || "")}
                className="cursor-pointer text-base"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {!searchTerm && !showResults && (
        <p className="text-center text-sm">
          학과명으로 탐색하려면 검색어를 입력하고, 탐색하지 않으려면 다음단계로
          진행해주세요.
        </p>
      )}

      {showResults && (
        <>
          <RegionSelector />
          <p className="text-red-500">
            ⭐ 차트에서는 원할한 대학 비교를 위해 총점과 점수가{" "}
            <b>1000점으로 통일</b>
            되어 있습니다.
          </p>
          <div className="py-4">
            <div className="h-[500px] w-full overflow-x-auto">
              <JungsiStep2Chart
                data={filteredChartData}
                onSelectAdmission={(id) => {
                  setSelectedAdmissions((prev) =>
                    prev.includes(id)
                      ? prev.filter((item) => item !== id)
                      : [...prev, id],
                  );
                }}
                selectedAdmissions={selectedAdmissions}
                isSorted={isSorted}
                userScores={userScores}
              />
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="sort-switch"
                checked={isSorted}
                onCheckedChange={setIsSorted}
              />
              <Label htmlFor="sort-switch">추합컷 정렬</Label>
            </div>
          </div>
          <Step2DataTable
            data={filteredChartData}
            selectedAdmissions={selectedAdmissions}
            setSelectedAdmissions={setSelectedAdmissions}
            userScores={userScores}
          />
        </>
      )}

      <div className="flex items-center justify-center gap-4 py-12">
        <Button
          variant="outline"
          onClick={() => {
            updateFormData("region", []);
            updateFormData("selectedGeneralFieldName", "전체");
            prevStep();
          }}
        >
          이전 단계
        </Button>
        <Button onClick={handleNextClick}>다음 단계</Button>
      </div>
    </div>
  );
};
