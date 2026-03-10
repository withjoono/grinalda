import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getAdminDailySalesAPI } from '@/api2/statistics/dash-board';
import { toast } from 'sonner';

type DataPoint = {
  name: string;
  total: number;
};

export const useSalesData = () => {
  const [salesData, setSalesData] = useState<DataPoint[]>([]);
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [prevMonthlySales, setPrevMonthlySales] = useState<number>(0);
  const [todaySales, setTodaySales] = useState<number>(0);

  useEffect(() => {
    const fetchDailySales = async () => {
      const result = await getAdminDailySalesAPI();
      if (result.success) {
        const transformedData = Object.keys(result.data).map((key) => ({
          name: dayjs(key).format('YYYY-MM-DD'),
          total: result.data[key],
        }));
        setSalesData(transformedData);

        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const monthlyTotal = transformedData
          .filter(
            (d) => dayjs(d.name).year() === currentYear && dayjs(d.name).month() === currentMonth
          )
          .reduce((sum, d) => sum + d.total, 0);
        const prevMonthlyTotal = transformedData
          .filter(
            (d) =>
              dayjs(d.name).year() === currentYear && dayjs(d.name).month() === currentMonth - 1
          )
          .reduce((sum, d) => sum + d.total, 0);
        const todayTotal = transformedData
          .filter((d) => dayjs(d.name).isSame(dayjs(), 'day'))
          .reduce((sum, d) => sum + d.total, 0);
        setTodaySales(todayTotal);
        setMonthlySales(monthlyTotal);
        setPrevMonthlySales(prevMonthlyTotal);
      } else {
        toast.error(result.error);
      }
    };

    fetchDailySales();
  }, []);

  return { salesData, monthlySales, prevMonthlySales, todaySales };
};
