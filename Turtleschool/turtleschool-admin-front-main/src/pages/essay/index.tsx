import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import { useEffect, useState } from 'react';
import { getAdminEarlydEssayListAPI } from '@/api2/수시_서비스/논술-api';
import { EarlydEssay } from '@/api2/types/earlyd-essay';
import { toast } from 'sonner';

export default function EssayPage() {
  const [studentRecords, setStudentRecords] = useState<EarlydEssay[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      const result = await getAdminEarlydEssayListAPI({});

      if (!result.success) {
        toast.error('데이터 로드 중 에러가 발생했습니다.' + result.error);
        return;
      }
      setStudentRecords(result.data.list);
      setTotalCount(result.data.totalCount);

      console.log(result.data.list, result.data.totalCount, studentRecords);
    };
    fetch();
  }, []);
  return (
    <Layout>
      {/* ===== 상단 헤더 ===== */}
      <LayoutHeader>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== 메인 ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">논술 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">논술 통합정보 및 최저등급 관리</TabsTrigger>
              <TabsTrigger value="t2">논술 수학가능과목 관리</TabsTrigger>
              <TabsTrigger value="t3">논술 대학 백분위 최고,최저 관리</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            데이터 {totalCount}개
          </TabsContent>
          <TabsContent value="t2" className="space-y-4">
            b
          </TabsContent>
          <TabsContent value="t3" className="space-y-4">
            c
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
