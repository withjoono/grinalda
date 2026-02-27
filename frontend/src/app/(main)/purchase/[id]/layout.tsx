import { PageRoutes } from '@/constants/routes';
import { authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function PurchaseOrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect(PageRoutes.LOGIN);
  }
  return <div>{children}</div>;
}
