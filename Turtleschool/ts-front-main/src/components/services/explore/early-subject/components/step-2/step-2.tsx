import { useMemo, useState } from "react";
import { GroupedDataTable } from "./grouped-data-table";
import { Button } from "@/components/custom/button";
import { Link } from "@tanstack/react-router";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { useExploreEarlySubjectStepper } from "../../context/explore-early-subject-provider";
import { useGetExploreEarlySubjectStep2 } from "@/stores/server/features/explore/early-subject/queries";
import { IExploreEarlySubjectStep2Item } from "@/stores/server/features/explore/early-subject/interfaces";

export interface IEarlySubjectStep2GroupData {
  university_name: string; // 대학명
  university_region: string; // 대학지역
  admission_name: string; // 전형명
  general_field: string; // 계열
  is_applied: number; // 최저반영여부
  description: string; // 최저반영 TEXT
  ids: number[]; // 해당 그룹에 포함된 전형 id 목록
}

export const EarlySubjectStep2 = () => {
  const { prevStep, nextStep, formData, updateFormData } =
    useExploreEarlySubjectStepper();

  // queries
  const earlySubjectStep2 = useGetExploreEarlySubjectStep2(
    formData.step1SelectedIds,
  );
  const data = earlySubjectStep2.data?.items || [];
  const { data: mockExamScores } = useGetMockExamStandardScores();

  const [selectedUniversitiesTable, setSelectedUniversitiesTable] = useState<
    string[]
  >([]);

  // 대학-전형명-계열-최저내역으로 그룹화 (전체 데이터)
  const allGroupedData = useMemo(
    () => groupDataByUniversityTypeFieldDescription(data),
    [data],
  );

  // 다음단계로 (테이블에서 선택한 그룹에 포함된 수시전형 id를 전달)
  const handleNextClick = () => {
    updateFormData(
      "step2SelectedIds",
      selectedUniversitiesTable.flatMap(
        (key) => allGroupedData[key]?.ids || [],
      ),
    );
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 py-6">
      <div className="space-y-3">
        <div className="flex items-center pb-4">
          <img src="/images/ts-teacher.png" className="h-12 w-12" />
          <div>
            <p className="text-sm text-foreground/60">
              교과전형은 교과 비중이 단지 50% 이상일뿐, 당락은 오히려 최저와
              비교과에서 결정됩니다
            </p>
          </div>
        </div>
        <p className="text-center text-2xl font-semibold">
          최저등급 확인 ({selectedUniversitiesTable.length})
        </p>
      </div>
      <div className="space-y-2 pt-6">
        <p className="text-center font-semibold">🧐 내 최저등급</p>

        {mockExamScores?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <p>내 성적이 입력되지 않았어요 🥲</p>
            <Link to="/users/mock-exam" className="text-sm text-blue-500">
              모의고사 성적 입력하기
            </Link>
          </div>
        ) : null}
        <div className="grid grid-cols-2 text-sm">
          {mockExamScores?.data.map((n, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {n.subject_name} - <p className="text-primary">{n.grade}등급</p>
            </div>
          ))}
        </div>
      </div>
      <GroupedDataTable
        selectedUniversities={selectedUniversitiesTable}
        setSelectedUniversities={setSelectedUniversitiesTable}
        groupedData={allGroupedData}
      />
      <div className="flex items-center justify-center gap-4 py-12">
        <Button variant={"outline"} onClick={prevStep}>
          이전 단계
        </Button>
        <Button
          onClick={handleNextClick}
          disabled={selectedUniversitiesTable.length === 0}
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
};

const groupDataByUniversityTypeFieldDescription = (
  data: IExploreEarlySubjectStep2Item[],
): Record<string, IEarlySubjectStep2GroupData> => {
  return data.reduce<Record<string, IEarlySubjectStep2GroupData>>(
    (grouped, item) => {
      const key = `${item.university.name}-${item.university.region}-${item.admission.name}-${item.general_field.name}-${item.minimum_grade?.description || ""}`;
      if (!grouped[key]) {
        grouped[key] = {
          university_name: item.university.name,
          university_region: item.university.region,
          admission_name: item.admission.name,
          general_field: item.general_field.name,
          is_applied: item.minimum_grade?.is_applied === "Y" ? 1 : 0,
          description: item.minimum_grade?.description || "",
          ids: [item.id],
        };
      } else {
        grouped[key].ids.push(item.id);
      }
      return grouped;
    },
    {},
  );
};
