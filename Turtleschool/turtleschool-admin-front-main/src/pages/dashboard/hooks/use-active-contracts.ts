import { useEffect, useState } from 'react';
import { getAdminActiveContractCountAPI } from '@/api2/statistics/dash-board';
import { toast } from 'sonner';

export const useActiveContracts = () => {
  const [activeContractCount, setActiveContractCount] = useState<number>(0);

  useEffect(() => {
    const fetchActiveContract = async () => {
      const result = await getAdminActiveContractCountAPI();
      if (result.success) {
        setActiveContractCount(result.data);
      } else {
        toast.error(result.error);
      }
    };

    fetchActiveContract();
  }, []);

  return { activeContractCount };
};
