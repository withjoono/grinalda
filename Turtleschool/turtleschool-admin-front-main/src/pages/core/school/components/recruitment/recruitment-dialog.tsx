import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  IRecruitmentUnitData,
  ICreateRecruitmentUnitDto,
  IUpdateRecruitmentUnitDto,
  IRecruitmentUnitScoreData,
  IRecruitmentUnitInterviewData,
  IRecruitmentUnitMinimumGradeData,
} from '@/api/types/recruitment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useGeneralFields,
  useMajorFields,
  useMidFields,
  useMinorFields,
} from '@/hooks/use-fields-queries';

const defaultScores: Omit<IRecruitmentUnitScoreData, 'id'> = {
  grade_50_cut: null,
  grade_70_cut: null,
  convert_50_cut: null,
  convert_70_cut: null,
  risk_plus_5: null,
  risk_plus_4: null,
  risk_plus_3: null,
  risk_plus_2: null,
  risk_plus_1: null,
  risk_minus_1: null,
  risk_minus_2: null,
  risk_minus_3: null,
  risk_minus_4: null,
  risk_minus_5: null,
};

const defaultInterview: Omit<IRecruitmentUnitInterviewData, 'id'> = {
  is_reflected: 0,
  interview_type: '',
  materials_used: '',
  interview_process: '',
  evaluation_content: '',
  interview_date: '',
  interview_time: '',
};
const defaultMinimumGrade: Omit<IRecruitmentUnitMinimumGradeData, 'id'> = {
  is_applied: 'N',
  description: '',
};
interface RecruitmentUnitDialogProps {
  recruitmentUnit?: IRecruitmentUnitData;
  onCreate?: (dto: ICreateRecruitmentUnitDto) => void;
  onUpdate?: (dto: IUpdateRecruitmentUnitDto) => void;
  admissionId: number;
  trigger: React.ReactNode;
}

export function RecruitmentUnitDialog({
  recruitmentUnit,
  onCreate,
  onUpdate,
  trigger,
  admissionId,
}: RecruitmentUnitDialogProps) {
  const { data: generalFields } = useGeneralFields();
  const { data: majorFields } = useMajorFields();
  const { data: midFields } = useMidFields();
  const { data: minorFields } = useMinorFields();
  const [name, setName] = useState(recruitmentUnit?.name || '');
  const [recruitmentNumber, setRecruitmentNumber] = useState(
    recruitmentUnit?.recruitment_number || 0
  );
  const [generalFieldId, setGeneralFieldId] = useState(
    recruitmentUnit?.general_field?.id?.toString() || ''
  );
  const [majorFieldId, setMajorFieldId] = useState(
    recruitmentUnit?.minor_field?.mid_field?.major_field_id.toString() || ''
  );
  const [midFieldId, setMidFieldId] = useState(
    recruitmentUnit?.minor_field?.mid_field_id.toString() || ''
  );
  const [minorFieldId, setMinorFieldId] = useState(
    recruitmentUnit?.minor_field?.id?.toString() || ''
  );
  const [scores, setScores] = useState(recruitmentUnit?.scores || defaultScores);
  const [minimumGrade, setMinimumGrade] = useState(
    recruitmentUnit?.minimum_grade || defaultMinimumGrade
  );
  const [interview, setInterview] = useState(recruitmentUnit?.interview || defaultInterview);
  const [previousResults, setPreviousResults] = useState(
    recruitmentUnit?.previous_results.map((n) => ({
      ...n,
      grade_cut: parseFloat(n.grade_cut + ''),
      converted_score_cut: parseFloat(n.converted_score_cut + ''),
      competition_ratio: parseFloat(n.competition_ratio + ''),
    })) || []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (recruitmentUnit) {
      setName(recruitmentUnit.name);
      setRecruitmentNumber(recruitmentUnit.recruitment_number);
      setGeneralFieldId(recruitmentUnit.general_field?.id.toString() || '');
      setMajorFieldId(recruitmentUnit?.minor_field?.mid_field?.major_field_id.toString() || '');
      setMidFieldId(recruitmentUnit?.minor_field?.mid_field_id.toString() || '');
      setMinorFieldId(recruitmentUnit.minor_field?.id?.toString() || '');
      setScores(
        {
          grade_50_cut: parseFloat(recruitmentUnit.scores?.grade_50_cut + '' || '0'),
          grade_70_cut: parseFloat(recruitmentUnit.scores?.grade_70_cut + '' || '0'),
          convert_50_cut: parseFloat(recruitmentUnit.scores?.convert_50_cut + '' || '0'),
          convert_70_cut: parseFloat(recruitmentUnit.scores?.convert_70_cut + '' || '0'),
          risk_plus_5: parseFloat(recruitmentUnit.scores?.risk_plus_5 + '' || '0'),
          risk_plus_4: parseFloat(recruitmentUnit.scores?.risk_plus_4 + '' || '0'),
          risk_plus_3: parseFloat(recruitmentUnit.scores?.risk_plus_3 + '' || '0'),
          risk_plus_2: parseFloat(recruitmentUnit.scores?.risk_plus_2 + '' || '0'),
          risk_plus_1: parseFloat(recruitmentUnit.scores?.risk_plus_1 + '' || '0'),
          risk_minus_1: parseFloat(recruitmentUnit.scores?.risk_minus_1 + '' || '0'),
          risk_minus_2: parseFloat(recruitmentUnit.scores?.risk_minus_2 + '' || '0'),
          risk_minus_3: parseFloat(recruitmentUnit.scores?.risk_minus_3 + '' || '0'),
          risk_minus_4: parseFloat(recruitmentUnit.scores?.risk_minus_4 + '' || '0'),
          risk_minus_5: parseFloat(recruitmentUnit.scores?.risk_minus_5 + '' || '0'),
        } || defaultScores
      );
      setMinimumGrade(
        recruitmentUnit.minimum_grade
          ? {
              is_applied: recruitmentUnit.minimum_grade?.is_applied,
              description: recruitmentUnit.minimum_grade?.description,
            }
          : defaultMinimumGrade
      );
      setInterview(
        recruitmentUnit.interview
          ? {
              is_reflected: recruitmentUnit.interview.is_reflected,
              interview_type: recruitmentUnit.interview.interview_type,
              materials_used: recruitmentUnit.interview.materials_used,
              interview_process: recruitmentUnit.interview.interview_process,
              evaluation_content: recruitmentUnit.interview.evaluation_content,
              interview_date: recruitmentUnit.interview.interview_date,
              interview_time: recruitmentUnit.interview.interview_time,
            }
          : defaultInterview
      );
      setPreviousResults(
        recruitmentUnit?.previous_results.map((n) => ({
          year: n.year,
          result_criteria: n.result_criteria,
          recruitment_number: n.recruitment_number,
          grade_cut: parseFloat(n.grade_cut + ''),
          converted_score_cut: parseFloat(n.converted_score_cut + ''),
          competition_ratio: parseFloat(n.competition_ratio + ''),
        })) || []
      );
    }
  }, [recruitmentUnit]);

  const filteredMidFields = midFields?.filter(
    (midField) => midField.major_field_id.toString() === majorFieldId
  );

  const filteredMinorFields = minorFields?.filter(
    (minorField) => minorField.mid_field_id.toString() === midFieldId
  );

  const handleSave = () => {
    const commonData = {
      name,
      recruitment_number: recruitmentNumber,
      general_field_id: generalFieldId ? parseInt(generalFieldId) : undefined,
      minor_field_id: minorFieldId ? parseInt(minorFieldId) : undefined,
      scores,
      minimum_grade: minimumGrade,
      interview,
      previous_results: previousResults,
    };

    if (recruitmentUnit && onUpdate) {
      onUpdate(commonData);
    } else if (!recruitmentUnit && onCreate) {
      onCreate({
        ...commonData,
        admission_id: admissionId,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-[850px] overflow-y-auto sm:max-w-[1280px]">
        <DialogHeader>
          <DialogTitle>{recruitmentUnit ? '모집단위 수정' : '새 모집단위 추가'}</DialogTitle>
          <DialogDescription>
            모집단위 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="space-y-2">
            {/** 기본정보(모집단위, 계열) */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  모집단위명
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recruitmentNumber" className="text-right">
                  모집인원
                </Label>
                <Input
                  id="recruitmentNumber"
                  value={recruitmentNumber}
                  type="number"
                  onChange={(e) => setRecruitmentNumber(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="majorField" className="text-right">
                  계열
                </Label>
                <Select
                  value={generalFieldId}
                  onValueChange={(value: string) => {
                    setGeneralFieldId(value);
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="계열 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {generalFields?.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="majorField" className="text-right">
                  대계열
                </Label>
                <Select
                  value={majorFieldId}
                  onValueChange={(value: string) => {
                    setMajorFieldId(value);
                    setMidFieldId('');
                    setMinorFieldId('');
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="대계열 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {majorFields?.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="midField" className="text-right">
                  중계열
                </Label>
                <Select
                  value={midFieldId}
                  onValueChange={(value: string) => {
                    setMidFieldId(value);
                    setMinorFieldId('');
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="중계열 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMidFields?.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minorField" className="text-right">
                  소계열
                </Label>
                <Select
                  value={minorFieldId}
                  onValueChange={(value: string) => {
                    setMinorFieldId(value);
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="소계열 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMinorFields?.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Interview */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_reflected" className="text-right">
                  면접 점수 반영
                </Label>
                <Select
                  value={interview.is_reflected?.toString()}
                  onValueChange={(value: string) =>
                    setInterview({ ...interview, is_reflected: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="면접 점수 반영 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">예</SelectItem>
                    <SelectItem value="0">아니오</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interview_type" className="text-right">
                  면접 유형
                </Label>
                <Input
                  id="interview_type"
                  value={interview.interview_type || ''}
                  onChange={(e) => setInterview({ ...interview, interview_type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="materials_used" className="text-right">
                  면접 시 활용 자료
                </Label>
                <Input
                  id="materials_used"
                  value={interview.materials_used || ''}
                  onChange={(e) => setInterview({ ...interview, materials_used: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interview_process" className="text-right">
                  면접 진행 방식
                </Label>
                <Textarea
                  id="interview_process"
                  value={interview.interview_process || ''}
                  onChange={(e) =>
                    setInterview({ ...interview, interview_process: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="evaluation_content" className="text-right">
                  면접 평가 내용
                </Label>
                <Textarea
                  id="evaluation_content"
                  value={interview.evaluation_content || ''}
                  onChange={(e) =>
                    setInterview({ ...interview, evaluation_content: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interview_date" className="text-right">
                  면접 날짜
                </Label>
                <Input
                  id="interview_date"
                  type="date"
                  value={interview.interview_date || ''}
                  onChange={(e) => setInterview({ ...interview, interview_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interview_time" className="text-right">
                  면접 시간
                </Label>
                <Input
                  id="interview_time"
                  type="time"
                  value={interview.interview_time || ''}
                  onChange={(e) => setInterview({ ...interview, interview_time: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>

            {/* Minimum Grade */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_applied" className="text-right">
                  최저학력기준 적용
                </Label>
                <Select
                  value={minimumGrade.is_applied}
                  onValueChange={(value: 'Y' | 'N') =>
                    setMinimumGrade({ ...minimumGrade, is_applied: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="최저학력기준 적용 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">예</SelectItem>
                    <SelectItem value="N">아니오</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minimum_grade_description" className="text-right">
                  최저학력기준 설명
                </Label>
                <Textarea
                  id="minimum_grade_description"
                  value={minimumGrade.description || ''}
                  onChange={(e) =>
                    setMinimumGrade({ ...minimumGrade, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade_50_cut" className="text-right">
                등급 50% 컷
              </Label>
              <Input
                id="grade_50_cut"
                type="number"
                value={scores.grade_50_cut || ''}
                onChange={(e) =>
                  setScores({ ...scores, grade_50_cut: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade_70_cut" className="text-right">
                등급 70% 컷
              </Label>
              <Input
                id="grade_70_cut"
                type="number"
                value={scores.grade_70_cut || ''}
                onChange={(e) =>
                  setScores({ ...scores, grade_70_cut: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="convert_50_cut" className="text-right">
                환산 50% 컷
              </Label>
              <Input
                id="convert_50_cut"
                type="number"
                value={scores.convert_50_cut || ''}
                onChange={(e) =>
                  setScores({ ...scores, convert_50_cut: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="convert_70_cut" className="text-right">
                환산 70% 컷
              </Label>
              <Input
                id="convert_70_cut"
                type="number"
                value={scores.convert_70_cut || ''}
                onChange={(e) =>
                  setScores({ ...scores, convert_70_cut: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_plus_5'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_plus_5'} className="text-right">
                위험도+5
              </Label>
              <Input
                id={'risk_plus_5'}
                type="number"
                value={scores.risk_plus_5 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_plus_5: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_plus_4'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_plus_4'} className="text-right">
                위험도+4
              </Label>
              <Input
                id={'risk_plus_4'}
                type="number"
                value={scores.risk_plus_4 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_plus_4: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_plus_3'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_plus_3'} className="text-right">
                위험도+3
              </Label>
              <Input
                id={'risk_plus_3'}
                type="number"
                value={scores.risk_plus_3 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_plus_3: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_plus_2'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_plus_2'} className="text-right">
                위험도+2
              </Label>
              <Input
                id={'risk_plus_2'}
                type="number"
                value={scores.risk_plus_2 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_plus_2: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_plus_1'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_plus_1'} className="text-right">
                위험도+1
              </Label>
              <Input
                id={'risk_plus_1'}
                type="number"
                value={scores.risk_plus_1 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_plus_1: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_minus_1'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_minus_1'} className="text-right">
                위험도-1
              </Label>
              <Input
                id={'risk_minus_1'}
                type="number"
                value={scores.risk_minus_1 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_minus_1: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_minus_2'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_minus_2'} className="text-right">
                위험도-2
              </Label>
              <Input
                id={'risk_minus_2'}
                type="number"
                value={scores.risk_minus_2 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_minus_2: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_minus_3'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_minus_3'} className="text-right">
                위험도-3
              </Label>
              <Input
                id={'risk_minus_3'}
                type="number"
                value={scores.risk_minus_3 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_minus_3: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_minus_4'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_minus_4'} className="text-right">
                위험도-4
              </Label>
              <Input
                id={'risk_minus_4'}
                type="number"
                value={scores.risk_minus_4 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_minus_4: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div key={'risk_minus_5'} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={'risk_minus_5'} className="text-right">
                위험도-5
              </Label>
              <Input
                id={'risk_minus_5'}
                type="number"
                value={scores.risk_minus_5 || ''}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    risk_minus_5: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>

          {/* Previous Results */}
          <div className="space-y-2">
            <div className="space-y-2">
              {previousResults.map((result, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 rounded border p-4">
                  <div className="items-center gap-4">
                    <Label htmlFor={`year-${index}`} className="text-right">
                      연도
                    </Label>
                    <Input
                      id={`year-${index}`}
                      type="number"
                      value={result.year || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          year: parseInt(e.target.value),
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor={`result_criteria-${index}`} className="text-right">
                      입결 기준
                    </Label>
                    <Input
                      id={`result_criteria-${index}`}
                      value={result.result_criteria || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          result_criteria: e.target.value,
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor={`grade_cut-${index}`} className="text-right">
                      등급 컷
                    </Label>
                    <Input
                      id={`grade_cut-${index}`}
                      type="number"
                      value={result.grade_cut || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          grade_cut: parseFloat(e.target.value) || 0,
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor={`converted_score_cut-${index}`} className="text-right">
                      환산 점수 컷
                    </Label>
                    <Input
                      id={`converted_score_cut-${index}`}
                      type="number"
                      value={result.converted_score_cut || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          converted_score_cut: parseFloat(e.target.value) || 0,
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor={`competition_ratio-${index}`} className="text-right">
                      경쟁률
                    </Label>
                    <Input
                      id={`competition_ratio-${index}`}
                      type="number"
                      value={result.competition_ratio || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          competition_ratio: parseFloat(e.target.value) || 0,
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor={`recruitment_number-${index}`} className="text-right">
                      모집 인원
                    </Label>
                    <Input
                      id={`recruitment_number-${index}`}
                      type="number"
                      value={result.recruitment_number || ''}
                      onChange={(e) => {
                        const newResults = [...previousResults];
                        newResults[index] = {
                          ...newResults[index],
                          recruitment_number: parseInt(e.target.value) || null,
                        };
                        setPreviousResults(newResults);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const newResults = previousResults.filter((_, i) => i !== index);
                      setPreviousResults(newResults);
                    }}
                    className="col-span-4"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                setPreviousResults([
                  ...previousResults,
                  {
                    year: 2024,
                    result_criteria: '',
                    grade_cut: 0,
                    converted_score_cut: 0,
                    competition_ratio: 0,
                    recruitment_number: null,
                  },
                ]);
              }}
              className="col-span-4"
            >
              이전 연도 입결 정보 추가
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
