import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAdminSusiPassRecordAPI } from '@/api2/수시_서비스/합불사례-api';
import { SusiPassRecord } from '@/api2/types/susi-pass-record';
import { SusiPassRecordSection } from './components/susi-pass-record-section';

export default function SusiPassRecordPage() {
  const [studentRecords, setSusiPassRecords] = useState<SusiPassRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      const result = await getAdminSusiPassRecordAPI({});
      if (!result.success) {
        toast.error('데이터 로드 중 에러가 발생했습니다.' + result.error);
        return;
      }
      setSusiPassRecords(result.data.list);
      setTotalCount(result.data.totalCount);

      console.log(studentRecords, totalCount);
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">합불사례 데이터 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">합불 기록 관리</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            <SusiPassRecordSection />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
