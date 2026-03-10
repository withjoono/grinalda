import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getAdminRecentSignupsAPI } from '@/api2/statistics/dash-board';

type DataPoint = {
  name: string;
  total: number;
};

export const useSignupsData = () => {
  const [signupData, setSignupData] = useState<DataPoint[]>([]);
  const [monthlySignups, setMonthlySignups] = useState<number>(0);

  useEffect(() => {
    const fetchSignups = async () => {
      const result = await getAdminRecentSignupsAPI();
      if (result.success) {
        const transformedData = Object.keys(result.data).map((key) => ({
          name: dayjs(key).format('YYYY-MM-DD'),
          total: result.data[key],
        }));
        setSignupData(transformedData);

        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const monthlyCount = transformedData
          .filter(
            (d) => dayjs(d.name).year() === currentYear && dayjs(d.name).month() === currentMonth
          )
          .reduce((sum, d) => sum + d.total, 0);
        setMonthlySignups(monthlyCount);
      } else {
        console.error('Error fetching recent signups:', result.error);
      }
    };

    fetchSignups();
  }, []);

  return { signupData, monthlySignups };
};
