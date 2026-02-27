'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchoolSubjectSection } from './subjects/school-subject-section';
import { SchoolSubjectGroupSection } from './subject-groups/school-subject-group-section';
import { useAllSubjects } from '@/apis/hooks/use-subjects';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';

export default function AdminDataSchoolSubjectsPage() {
  const {
    data: SchoolSubjects,
    isPending,
    isError,
    refetch,
  } = useAllSubjects();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <Tabs defaultValue='group'>
        <TabsList>
          <TabsTrigger value='group'>교과 관리</TabsTrigger>
          <TabsTrigger value='subject'>과목 관리</TabsTrigger>
        </TabsList>
        <TabsContent value='group'>
          <SchoolSubjectGroupSection schoolSubjectGroups={SchoolSubjects} />
        </TabsContent>
        <TabsContent value='subject'>
          <SchoolSubjectSection schoolSubjects={SchoolSubjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
