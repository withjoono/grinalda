'use client';
import {
  useGetActiveSubscriptions,
  useGetPendingInquiries,
  useGetRecentPayments,
  useGetSales,
  useGetSignups,
} from '@/apis/hooks/admin/use-admin-statistics';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import {
  ActivityIcon,
  CreditCardIcon,
  MessageCircleQuestionIcon,
  UsersIcon,
} from 'lucide-react';
import { RecentSales } from './_components/recent-sales';
import { OverviewRecentSales } from './_components/overview-recent-sales';
import { OverviewRecentSignups } from './_components/overview-recent-signups';
import { format, getYear, getMonth, isSameDay } from 'date-fns';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export type DataPoint = {
  name: string;
  total: number;
};

export default function AdminDashboardPage() {
  const { data: recentPayments } = useGetRecentPayments();
  const { data: signups } = useGetSignups();
  const { data: sales } = useGetSales();
  const { data: pendingInquiries } = useGetPendingInquiries();
  const { data: activeSubscriptions } = useGetActiveSubscriptions();

  const {
    monthlySales,
    prevMonthlySales,
    todaySales,
    monthlySignups,
    salesData,
    signupsData,
  } = useMemo(() => {
    if (!sales || !signups) {
      return {
        monthlySales: 0,
        prevMonthlySales: 0,
        todaySales: 0,
        monthlySignups: 0,
        salesData: [],
        signupsData: [],
      };
    }

    const now = new Date();
    const currentYear = getYear(now);
    const currentMonth = getMonth(now);

    // Sales 데이터 변환
    const salesData: DataPoint[] = Object.entries(sales).map(
      ([date, amount]) => ({
        name: format(new Date(date), 'yyyy-MM-dd'),
        total: amount,
      })
    );

    // Signups 데이터 변환
    const signupsData: DataPoint[] = Object.entries(signups).map(
      ([date, count]) => ({
        name: format(new Date(date), 'yyyy-MM-dd'),
        total: count,
      })
    );

    // 월별 통계 계산
    const monthlySales = salesData
      .filter(
        (d) =>
          getYear(new Date(d.name)) === currentYear &&
          getMonth(new Date(d.name)) === currentMonth
      )
      .reduce((sum, d) => sum + d.total, 0);

    const prevMonthlySales = salesData
      .filter(
        (d) =>
          getYear(new Date(d.name)) === currentYear &&
          getMonth(new Date(d.name)) === currentMonth - 1
      )
      .reduce((sum, d) => sum + d.total, 0);

    const todaySales = salesData
      .filter((d) => isSameDay(new Date(d.name), now))
      .reduce((sum, d) => sum + d.total, 0);

    const monthlySignups = signupsData
      .filter(
        (d) =>
          getYear(new Date(d.name)) === currentYear &&
          getMonth(new Date(d.name)) === currentMonth
      )
      .reduce((sum, d) => sum + d.total, 0);

    return {
      monthlySales,
      prevMonthlySales,
      todaySales,
      monthlySignups,
      salesData,
      signupsData,
    };
  }, [sales, signups]);

  return (
    <div className='mx-auto space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              이번달 판매량({getMonth(new Date()) + 1}월)
            </CardTitle>
            <CreditCardIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              +{formatPrice(monthlySales)}
            </div>
            <p className='pt-1 text-sm text-foreground/70'>
              지난달({formatPrice(prevMonthlySales)}) 대비{' '}
              {formatPrice(monthlySales - prevMonthlySales)} 증가
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              오늘 판매량({format(new Date(), 'yyyy-MM-dd')})
            </CardTitle>
            <CreditCardIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+{formatPrice(todaySales)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              이번달 가입자 수({getMonth(new Date()) + 1}월)
            </CardTitle>
            <UsersIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+{monthlySignups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              현재 활성 사용자(계약)
            </CardTitle>
            <ActivityIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeSubscriptions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>대기중인 문의</CardTitle>
            <MessageCircleQuestionIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {pendingInquiries || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>
              최근 가입자({format(new Date(), 'yyyy-MM-dd')}기준)
            </CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <OverviewRecentSignups data={signupsData} />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>최근 판매</CardTitle>
            <CardDescription>최근 결제 완료된 20개 목록</CardDescription>
          </CardHeader>
          <CardContent className=''>
            <ScrollArea className='h-[400px] px-4'>
              <RecentSales data={recentPayments || []} />
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-7'>
          <CardHeader>
            <CardTitle>결제 추이({format(new Date(), 'yyyy-MM-dd')}기준)</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <OverviewRecentSales data={salesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
