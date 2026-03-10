import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import AdmissionSubtypeManagement from './components/admission-subtype-management';
import AdmissionCategoryManagement from './components/admission-category-management';

export default function CoreAdmissionPage() {
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">전형 유형 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">전형중심분류</TabsTrigger>
              <TabsTrigger value="t2">세부 유형</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            <AdmissionCategoryManagement />
          </TabsContent>
          <TabsContent value="t2" className="space-y-4">
            <AdmissionSubtypeManagement />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
