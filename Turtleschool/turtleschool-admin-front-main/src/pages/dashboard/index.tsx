import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { TopNav } from '@/components/top-nav';
import { UserNav } from '@/components/user-nav';
import { RecentSales } from './components/recent-sales';
import { IconActivity, IconCreditCard, IconUsers } from '@tabler/icons-react';
import { OverviewRecentSignups } from './components/overview-recent-signups';
import dayjs from 'dayjs';
import { formatPrice } from '@/lib/utils';
import { OverviewRecentSales } from './components/overview-recent-sales';
import { useSignupsData } from './hooks/use-signup-data';
import { useSalesData } from './hooks/use-sales-data';
import { useActiveContracts } from './hooks/use-active-contracts';

export default function Dashboard() {
  const { signupData, monthlySignups } = useSignupsData();
  const { salesData, monthlySales, prevMonthlySales, todaySales } = useSalesData();
  const { activeContractCount } = useActiveContracts();

  return (
    <Layout>
      {/* ===== 상단 헤더 ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== 메인 ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">대시보드</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                분석
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                보고서
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                알림
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    이번달 판매량({dayjs().month() + 1}월)
                  </CardTitle>
                  <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{formatPrice(monthlySales)}</div>
                  <p className="pt-1 text-sm text-foreground/70">
                    지난달({formatPrice(prevMonthlySales)}) 대비{' '}
                    {formatPrice(monthlySales - prevMonthlySales)} 증가
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    오늘 판매량({dayjs().format('YYYY-MM-DD')})
                  </CardTitle>
                  <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{formatPrice(todaySales)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    이번달 가입자 수({dayjs().month() + 1}월)
                  </CardTitle>
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{monthlySignups}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">현재 활성 사용자(계약)</CardTitle>
                  <IconActivity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeContractCount}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>최근 가입자({dayjs().format('YYYY-MM-DD')}기준)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewRecentSignups data={signupData} />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>최근 판매</CardTitle>
                  <CardDescription>최근 결제 완료된 20개 목록</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-scroll">
                  <RecentSales />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-7">
                <CardHeader>
                  <CardTitle>결제 추이({dayjs().format('YYYY-MM-DD')}기준)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewRecentSales data={salesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
}

const topNav = [
  {
    title: '개요',
    href: '/',
    isActive: true,
  },
];
