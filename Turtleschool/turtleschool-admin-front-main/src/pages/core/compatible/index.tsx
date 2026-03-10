import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import GeneralFieldManagement from './components/general-field-management';
import MajorFieldManagement from './components/major-field-management';
import MidFieldManagement from './components/mid-field-management';
import MinorFieldManagement from './components/minor-field-management';

export default function CoreCompatiblePage() {
  return (
    <Layout>
      <LayoutHeader>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== 메인 ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">계열 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">일반계열 관리</TabsTrigger>
              <TabsTrigger value="t2">대계열 관리</TabsTrigger>
              <TabsTrigger value="t3">중계열 관리</TabsTrigger>
              <TabsTrigger value="t4">소계열 관리</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            <GeneralFieldManagement />
          </TabsContent>
          <TabsContent value="t2" className="space-y-4">
            <MajorFieldManagement />
          </TabsContent>
          <TabsContent value="t3" className="space-y-4">
            <MidFieldManagement />
          </TabsContent>
          <TabsContent value="t4" className="space-y-4">
            <MinorFieldManagement />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
