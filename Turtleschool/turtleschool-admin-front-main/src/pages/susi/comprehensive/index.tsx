import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import { SusiComprehensiveSection } from './components/susi-comprehensive-section/susi-comprehensive-section';

export default function SusiComprehensivePage() {
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">학종 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">수시 학종 관리</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            <SusiComprehensiveSection />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
