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
  IAdmissionData,
  ICreateAdmissionDto,
  IUpdateAdmissionDto,
  IAdmissionMethodData,
} from '@/api/types/admission';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdmissionSubtypes } from '@/hooks/use-admission-subtype-queries';
import { useAdmissionCategories } from '@/hooks/use-admission-category-queries';

interface AdmissionDialogProps {
  admission?: IAdmissionData;
  onCreate?: (dto: ICreateAdmissionDto) => void;
  onUpdate?: (dto: IUpdateAdmissionDto) => void;
  universityId: number;
  trigger: React.ReactNode;
}

export function AdmissionDialog({
  admission,
  onCreate,
  onUpdate,
  trigger,
  universityId,
}: AdmissionDialogProps) {
  const [name, setName] = useState(admission?.name || '');
  const [year, setYear] = useState(admission?.year.toString() || '');
  const [basicType, setBasicType] = useState<'일반' | '특별'>(admission?.basic_type || '일반');
  const [categoryId, setCategoryId] = useState<string>('');
  const [method, setMethod] = useState<Omit<IAdmissionMethodData, 'id'>>({
    method_description: admission?.method.method_description || '',
    subject_ratio: admission?.method.document_ratio || null,
    document_ratio: admission?.method.document_ratio || null,
    interview_ratio: admission?.method.interview_ratio || null,
    practical_ratio: admission?.method.practical_ratio || null,
    other_details: admission?.method.other_details || null,
    second_stage_first_ratio: admission?.method.second_stage_first_ratio || null,
    second_stage_interview_ratio: admission?.method.second_stage_interview_ratio || null,
    second_stage_other_ratio: admission?.method.second_stage_other_ratio || null,
    second_stage_other_details: admission?.method.second_stage_other_details || null,
    eligibility: admission?.method.eligibility || '',
    school_record_evaluation_score: admission?.method.school_record_evaluation_score || '',
    school_record_evaluation_elements: admission?.method.school_record_evaluation_elements || '',
  });
  const [selectedSubtypeIds, setSelectedSubtypeIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const { data: subTypes } = useAdmissionSubtypes();
  const { data: categories } = useAdmissionCategories();

  useEffect(() => {
    if (admission) {
      setName(admission.name);
      setYear(admission.year.toString());
      setBasicType(admission.basic_type);
      setMethod({
        method_description: admission.method.method_description,
        subject_ratio: Number(admission.method.subject_ratio),
        document_ratio: Number(admission.method.document_ratio),
        interview_ratio: Number(admission.method.interview_ratio),
        practical_ratio: Number(admission.method.practical_ratio),
        other_details: admission.method.other_details,
        second_stage_first_ratio: Number(admission.method.second_stage_first_ratio),
        second_stage_interview_ratio: Number(admission.method.second_stage_interview_ratio),
        second_stage_other_ratio: Number(admission.method.second_stage_other_ratio),
        second_stage_other_details: admission.method.second_stage_other_details,
        eligibility: admission.method.eligibility,
        school_record_evaluation_score: admission?.method.school_record_evaluation_score || '',
        school_record_evaluation_elements:
          admission?.method.school_record_evaluation_elements || '',
      });
      setCategoryId(admission.category.id + '');
      setSelectedSubtypeIds(admission.subtypes.map((n) => n.id));
    }
  }, [admission]);

  const handleSave = () => {
    if (admission && onUpdate) {
      // 수정
      onUpdate({
        name: name,
        year: Number(year),
        basic_type: basicType,
        university_id: universityId,
        category_id: Number(categoryId),
        subtype_ids: selectedSubtypeIds,
        method: method,
      });
    }
    if (!admission && onCreate) {
      // 생성
      onCreate({
        name: name,
        year: Number(year),
        basic_type: basicType,
        university_id: universityId,
        category_id: categoryId as any,
        subtype_ids: selectedSubtypeIds,
        method: method,
      });
    }
    setOpen(false);
  };

  const handleSubtypeClick = (id: number) => {
    if (selectedSubtypeIds.includes(id)) {
      setSelectedSubtypeIds(selectedSubtypeIds.filter((n) => n !== id));
    } else {
      setSelectedSubtypeIds([...selectedSubtypeIds, id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-auto overflow-y-auto sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>{admission ? '전형 수정' : '새 전형 추가'}</DialogTitle>
          <DialogDescription>
            전형 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                전형명
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                년도
              </Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basicType" className="text-right">
                기본 유형
              </Label>
              <Select
                value={basicType}
                onValueChange={(value: '일반' | '특별') => {
                  setBasicType(value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="전형타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반">일반</SelectItem>
                  <SelectItem value="특별">특별</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basicType" className="text-right">
                카테고리
              </Label>
              <Select
                value={categoryId}
                onValueChange={(value: string) => {
                  setCategoryId(value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="전형타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((item) => (
                    <SelectItem key={item.id} value={item.id + ''}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="methodDescription" className="text-right">
                전형 방법 설명
              </Label>
              <Textarea
                id="methodDescription"
                value={method.method_description}
                onChange={(e) => setMethod({ ...method, method_description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectRatio" className="text-right">
                교과 비율
              </Label>
              <Input
                id="subjectRatio"
                value={method.subject_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({ ...method, subject_ratio: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectRatio" className="text-right">
                서류 비율
              </Label>
              <Input
                id="documentRatio"
                value={method.document_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({ ...method, document_ratio: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interviewRatio" className="text-right">
                면접 비율
              </Label>
              <Input
                id="interviewRatio"
                value={method.interview_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({ ...method, interview_ratio: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="practicalRatio" className="text-right">
                실기 비율
              </Label>
              <Input
                id="practicalRatio"
                value={method.practical_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({ ...method, practical_ratio: parseFloat(e.target.value) || null })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="otherDetails" className="text-right">
                기타 내역
              </Label>
              <Textarea
                id="otherDetails"
                value={method.other_details || ''}
                onChange={(e) => setMethod({ ...method, other_details: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondStageFirstRatio" className="text-right">
                2단계 1단계 성적 비율
              </Label>
              <Input
                id="secondStageFirstRatio"
                value={method.second_stage_first_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({
                    ...method,
                    second_stage_first_ratio: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondStageInterviewRatio" className="text-right">
                2단계 면접 비율
              </Label>
              <Input
                id="secondStageInterviewRatio"
                value={method.second_stage_interview_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({
                    ...method,
                    second_stage_interview_ratio: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondStageOtherRatio" className="text-right">
                2단계 기타 비율
              </Label>
              <Input
                id="secondStageOtherRatio"
                value={method.second_stage_other_ratio?.toString() || ''}
                onChange={(e) =>
                  setMethod({
                    ...method,
                    second_stage_other_ratio: parseFloat(e.target.value) || null,
                  })
                }
                className="col-span-3"
                type="number"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondStageOtherDetails" className="text-right">
                2단계 기타 내역
              </Label>
              <Textarea
                id="secondStageOtherDetails"
                value={method.second_stage_other_details || ''}
                onChange={(e) =>
                  setMethod({ ...method, second_stage_other_details: e.target.value })
                }
                className="col-span-3 h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eligibility" className="text-right">
                지원 자격
              </Label>
              <Textarea
                id="eligibility"
                value={method.eligibility}
                onChange={(e) => setMethod({ ...method, eligibility: e.target.value })}
                className="col-span-3 h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schoolRecordEvaluationElements" className="text-right">
                생기부 반영 요소(GA/AE/A)
              </Label>
              <Input
                id="schoolRecordEvaluationElements"
                value={method.school_record_evaluation_elements?.toString() || ''}
                onChange={(e) =>
                  setMethod({
                    ...method,
                    school_record_evaluation_elements: e.target.value || '',
                  })
                }
                className="col-span-3"
                type="text"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schoolRecordEvaluationRatio" className="text-right">
                생기부 점수 배점(30/30/40)
              </Label>
              <Input
                id="schoolRecordEvaluationRatio"
                value={method.school_record_evaluation_score?.toString() || ''}
                onChange={(e) =>
                  setMethod({
                    ...method,
                    school_record_evaluation_score: e.target.value || '',
                  })
                }
                className="col-span-3"
                type="text"
              />
            </div>
            <h3 className="font-semibold">특별 전형 선택(선택한 전형들로 필터링됩니다)</h3>
            <div className="flex flex-wrap gap-2">
              {subTypes?.map((n) => (
                <Button
                  onClick={() => handleSubtypeClick(n.id)}
                  variant={selectedSubtypeIds.includes(n.id) ? 'default' : 'outline'}
                >
                  {n.name}
                </Button>
              ))}
            </div>
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
