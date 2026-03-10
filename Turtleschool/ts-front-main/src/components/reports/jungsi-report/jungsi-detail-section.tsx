import React from "react";
import { DataGrid } from "@/components/custom/data-grid";
import { IRegularAdmissionDetail } from "@/stores/server/features/jungsi/interfaces";

interface JungsiDetailSectionProps {
  admission: IRegularAdmissionDetail;
}

export const JungsiDetailSection: React.FC<JungsiDetailSectionProps> = ({
  admission,
}) => {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">1. 전형 개요</h3>
        <DataGrid
          data={[
            { label: "전형명", value: admission.admission_name },
            { label: "모집군", value: admission.admission_type },
            { label: "계열", value: admission.general_field_name },
            { label: "모집단위", value: admission.recruitment_name || "-" },
            { label: "모집인원", value: admission.recruitment_number },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">2. 전형 방법</h3>
        <DataGrid
          data={[
            { label: "선발방식", value: admission.selection_method || "-" },
            { label: "수능 비율", value: `${admission.csat_ratio || 0}%` },
            {
              label: "학생부 비율",
              value: `${admission.school_record_ratio || 0}%`,
            },
            { label: "면접 비율", value: `${admission.interview_ratio || 0}%` },
            { label: "기타 비율", value: `${admission.other_ratio || 0}%` },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">3. 수능 반영 방법</h3>
        <DataGrid
          data={[
            { label: "수능 요소", value: admission.csat_elements || "-" },
            { label: "수능 조합", value: admission.csat_combination || "-" },
            { label: "필수 영역", value: admission.csat_required || "-" },
            { label: "선택 영역", value: admission.csat_optional || "-" },
            {
              label: "탐구 과목 수",
              value: admission.research_subject_count || "-",
            },
          ]}
        />
        <h4 className="text-lg font-medium">영역별 반영 점수</h4>
        <DataGrid
          data={[
            {
              label: "국어",
              value: admission.korean_reflection_score
                ? parseFloat(admission.korean_reflection_score).toFixed(2)
                : "-",
            },
            {
              label: "수학",
              value: admission.math_reflection_score
                ? parseFloat(admission.math_reflection_score).toFixed(2)
                : "-",
            },
            {
              label: "탐구",
              value: admission.research_reflection_score
                ? parseFloat(admission.research_reflection_score).toFixed(2)
                : "-",
            },
            {
              label: "영어",
              value: admission.english_reflection_score
                ? parseFloat(admission.english_reflection_score).toFixed(2)
                : "-",
            },
            {
              label: "한국사",
              value: admission.korean_history_reflection_score
                ? parseFloat(admission.korean_history_reflection_score).toFixed(
                    2,
                  )
                : "-",
            },
            {
              label: "제2외국어",
              value: admission.second_foreign_language_reflection_score
                ? parseFloat(
                    admission.second_foreign_language_reflection_score,
                  ).toFixed(2)
                : "-",
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">4-1. 가산점 (수학)</h3>
        <DataGrid
          data={[
            {
              label: "선택과목",
              value: admission.math_elective_subject || "-",
            },
            {
              label: "확률과통계 가산점",
              value:
                admission.math_probability_statistics_additional_points || "-",
            },
            {
              label: "미적분 가산점",
              value: admission.math_calculus_additional_points || "-",
            },
            {
              label: "기하 가산점",
              value: admission.math_geometry_additional_points || "-",
            },
          ]}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">4-2. 가산점 (탐구)</h3>
        <DataGrid
          data={[
            { label: "유형", value: admission.research_type || "-" },
            {
              label: "사회 가산점",
              value: admission.research_social_additional_points || "-",
            },
            {
              label: "과학 가산점",
              value: admission.research_science_additional_points || "-",
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">
          5. 영어/한국사 등급별 점수
        </h3>
        <h4 className="text-lg font-medium">
          영어 ({admission.english_application_criteria})
        </h4>
        <DataGrid
          data={[
            { label: "1등급", value: admission.english_grade_1_score || "-" },
            { label: "2등급", value: admission.english_grade_2_score || "-" },
            { label: "3등급", value: admission.english_grade_3_score || "-" },
            { label: "4등급", value: admission.english_grade_4_score || "-" },
            { label: "5등급", value: admission.english_grade_5_score || "-" },
            { label: "6등급", value: admission.english_grade_6_score || "-" },
            { label: "7등급", value: admission.english_grade_7_score || "-" },
            { label: "8등급", value: admission.english_grade_8_score || "-" },
            { label: "9등급", value: admission.english_grade_9_score || "-" },
          ]}
        />
        <h4 className="text-lg font-medium">
          한국사 ({admission.korean_history_application_criteria})
        </h4>
        <DataGrid
          data={[
            {
              label: "1등급",
              value: admission.korean_history_grade_1_score || "-",
            },
            {
              label: "2등급",
              value: admission.korean_history_grade_2_score || "-",
            },
            {
              label: "3등급",
              value: admission.korean_history_grade_3_score || "-",
            },
            {
              label: "4등급",
              value: admission.korean_history_grade_4_score || "-",
            },
            {
              label: "5등급",
              value: admission.korean_history_grade_5_score || "-",
            },
            {
              label: "6등급",
              value: admission.korean_history_grade_6_score || "-",
            },
            {
              label: "7등급",
              value: admission.korean_history_grade_7_score || "-",
            },
            {
              label: "8등급",
              value: admission.korean_history_grade_8_score || "-",
            },
            {
              label: "9등급",
              value: admission.korean_history_grade_9_score || "-",
            },
          ]}
        />
      </div>
    </section>
  );
};
