import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/custom/button';
import { toast } from 'sonner';
import { commonCodeEndpoints } from '@/api/endpoints/common-code-endpoints';
import { ISubjectCodeData } from '@/api/types/common-code-types';
import { SubjectCodeTable } from './subject-code-table';

export const SubjectCodeSection = () => {
  const [subjectCodes, setSubjectCodes] = useState<ISubjectCodeData[]>([]);
  const [mainSubjectList, setMainSubjectList] = useState<{ code: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const result = await commonCodeEndpoints.getSubjectCodes();
      if (!result.success) {
        toast.error('데이터 로드 중 에러가 발생했습니다.' + result.error);
        return;
      }
      setSubjectCodes(result.data);
      const cache = new Map();
      const arr: { code: string; name: string }[] = [];
      if (result.data.length) {
        result.data.forEach((n) => {
          if (cache.get(n.main_subject_code)) return;
          cache.set(n.main_subject_code, 1);
          arr.push({ code: n.main_subject_code, name: n.main_subject_name });
        });
        setMainSubjectList(arr);
        setSelectedSubject(result.data[0].main_subject_code);
      }
    };
    fetch();
  }, []);

  const courseData = useMemo(() => {
    return subjectCodes.filter((n) => n.main_subject_code === selectedSubject);
  }, [selectedSubject]);

  return (
    <>
      <h3 className="text-3xl font-bold">과목 코드 선택 ({subjectCodes.length})</h3>
      <div className="flex flex-wrap gap-2">
        {mainSubjectList.map((item) => {
          return (
            <Button
              key={item.name}
              variant={selectedSubject === item.code ? 'default' : 'outline'}
              onClick={() => setSelectedSubject(item.code)}
            >
              {item.name} ({item.code})
            </Button>
          );
        })}
      </div>
      <SubjectCodeTable data={courseData} totalCount={courseData.length} />
    </>
  );
};
