import { PageRoutes } from '@/constants/routes';
import { authOptions } from '@/lib/auth-options';
import { toUrl } from '@/lib/utils';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const result = await paymentApi({ request });
  if (result.success) {
    redirect(toUrl(PageRoutes.USER_PAYMENT));
  } else {
    redirect(toUrl(PageRoutes.ERROR));
  }
}

const paymentApi = async ({ request }: { request: Request }) => {
  try {
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    const authResultCode = formData.get('authResultCode');
    const authResultMsg = formData.get('authResultMsg');
    const tid = formData.get('tid');
    const orderId = formData.get('orderId');
    const clientId = formData.get('clientId');
    const amount = formData.get('amount');
    const authToken = formData.get('authToken');
    const signature = formData.get('signature');

    await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/payments`,
      {
        authResultCode,
        authResultMsg,
        tid,
        orderId,
        clientId,
        amount,
        authToken,
        signature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );
    return { success: true };
  } catch {
    return { success: false };
  }
};
