import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { UserNav } from '@/components/user-nav';
import { PayOrderSection } from './pay-order-section/pay-order-section';

export default function PayPage() {
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">결제 관리</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="t1" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="t1">결제 내역</TabsTrigger>
              <TabsTrigger value="t2">환불 처리</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="t1" className="space-y-4">
            <PayOrderSection />
          </TabsContent>
          <TabsContent value="t2" className="space-y-4">
            환불 처리
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}
