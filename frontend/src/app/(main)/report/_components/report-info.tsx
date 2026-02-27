import { EarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import { AdmissionTypeBadge } from '@/components/badges/admission-type-badge';
import { RegionBadge } from '@/components/badges/region-badge';

export const ReportInfo = ({
  earlyAdmission,
}: {
  earlyAdmission: EarlyAdmissionDetail;
}) => {
  return (
    <div className='space-y-6 lg:max-w-3xl'>
      {/* 헤더 섹션 */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <RegionBadge name={earlyAdmission.university.region.name} />
          <AdmissionTypeBadge name={earlyAdmission.admissionType.name} />
        </div>
        <h2 className='text-xl font-semibold md:text-3xl'>
          {earlyAdmission.university.name} - {earlyAdmission.departmentName}
        </h2>
      </div>

      {/* 주요 정보 섹션 */}
      <div className='grid grid-cols-2 gap-4 border-t pt-4'>
        <div className='space-y-2'>
          <div className='text-sm text-muted-foreground'>전형명</div>
          <div className='font-medium'>{earlyAdmission.admissionName}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm text-muted-foreground'>모집인원</div>
          <div className='font-medium'>{earlyAdmission.quota}</div>
        </div>
      </div>
    </div>
  );
};
