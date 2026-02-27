'use client';
import {
  useCheckCoupon,
  useFreePayment,
  useGetActiveSubscriptions,
  usePreparePayment,
} from '@/apis/hooks/use-payments';
import { useActiveProducts } from '@/apis/hooks/use-products';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PageRoutes } from '@/constants/routes';
import { formatPrice, toUrl } from '@/lib/utils';
import { AxiosError } from 'axios';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PurchaseOrderPage() {
  const session = useSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: products, isPending, isError, refetch } = useActiveProducts();
  const product = products?.find((product) => product.id === Number(id));
  const { data: activeSubscriptions } = useGetActiveSubscriptions();
  const { mutateAsync: preparePayment } = usePreparePayment();
  const activeServiceCodes = activeSubscriptions?.map(
    (subscription) => subscription.serviceCode
  );
  const { mutateAsync: checkCoupon } = useCheckCoupon();

  const [isAgreed, setIsAgreed] = useState(false);

  const [openCouponModal, setOpenCouponModal] = useState(false); // 쿠폰등록 모달창 상태
  const [_couponNumber, _setCouponNumber] = useState<string>(''); // 인풋 값

  // 쿠폰등록 성공 시
  const [couponNumber, setCouponNumber] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponInfo, setCouponInfo] = useState<string>('');

  const { mutateAsync: freePayment } = useFreePayment();

  const resetCoupon = () => {
    setCouponNumber('');
    setDiscountAmount(0);
    setCouponInfo('');
  };

  const handleCouponSubmit = async () => {
    try {
      const { isValid, coupon } = await checkCoupon({
        data: {
          couponNumber: _couponNumber,
          productId: Number(id),
        },
      });
      if (isValid) {
        setCouponNumber(_couponNumber);
        setDiscountAmount(coupon.discountAmount);
        setCouponInfo(coupon.name);
        toast.success('쿠폰등록 성공');
      } else {
        toast.error('쿠폰이 존재하지 않습니다.');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('쿠폰 검증 실패');
      }
    } finally {
      setOpenCouponModal(false);
      _setCouponNumber('');
    }
  };

  const handlePayment = async () => {
    if (!product) return;
    if (activeServiceCodes?.includes(product.serviceCode)) {
      toast.error('이미 구독중인 기능입니다.');
      return;
    }
    try {
      if (product.price - discountAmount === 0) {
        const { success } = await freePayment({
          data: {
            productId: Number(id),
            couponNumber: couponNumber,
          },
        });
        if (success) {
          toast.success('결제가 완료되었습니다.');
          router.replace(toUrl(PageRoutes.USER_PAYMENT));
        } else {
          toast.error('결제 실패');
        }
      } else {
        if (typeof window !== 'undefined') {
          const { orderId, productName, finalAmount } = await preparePayment({
            data: {
              productId: Number(id),
              couponNumber: couponNumber,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pay_obj: any = window;
          const { AUTHNICE } = pay_obj;
          AUTHNICE.requestPay({
            buyerName: session.data?.user.name,
            buyerEmail: session.data?.user.email,
            //NOTE :: 발급받은 클라이언트키 clientId에 따라 Server / Client 방식 분리
            clientId: process.env.NEXT_PUBLIC_NICE_CLIENT_ID,
            method: 'card',
            //NOTE :: 상품 구매 id 값
            orderId: orderId,
            // NOTE :: 가격
            amount: finalAmount,
            // NOTE :: 상품명
            goodsName: productName,
            //NOTE :: API를 호출할 Endpoint 입력
            returnUrl:
              process.env.NEXT_PUBLIC_CLIENT_URL + '/api/payments/callback',
            // NOTE :: err 발생시 실행 함수
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fnError: (result: any) => {
              toast.error(result?.errorMsg || '결제 실패');
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('결제 실패');
      }
    }
  };

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection text='상품 조회 실패' onRetry={refetch} />;

  if (!product) return <ErrorSection text='상품이 존재하지 않습니다.' />;

  return (
    <div className='mx-auto w-full max-w-screen-md px-4 py-12 pb-40 lg:max-w-screen-xl'>
      <div className='flex w-full flex-col gap-2 space-y-8 pt-4 lg:flex-row'>
        <div className='w-full space-y-2 p-4 py-8'>
          <h3 className='text-2xl font-semibold'>상품 정보</h3>
          <div className='flex w-full items-start justify-between'>
            <div className='space-y-1'>
              <p className='text-xl'>{product.name}</p>
              <p className='text-base'>{product.description}</p>
            </div>
            <p className='text-xl'>{formatPrice(product.price)}</p>
          </div>
          <div className='text-right'>
            {couponInfo ? (
              <div className='flex items-center justify-end gap-2'>
                <p className='text-primary'>
                  {couponInfo}(-{formatPrice(discountAmount)})
                </p>
                <Button
                  className='h-auto p-2'
                  variant={'destructive'}
                  type='button'
                  onClick={resetCoupon}
                >
                  <TrashIcon className='size-4' />
                </Button>
              </div>
            ) : (
              <Dialog onOpenChange={setOpenCouponModal} open={openCouponModal}>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className='h-auto border-primary px-6 py-2 text-primary hover:bg-foreground/5 hover:text-primary'
                  >
                    <PlusIcon className='mr-2 size-4' /> 쿠폰등록
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>쿠폰등록</DialogTitle>
                    <DialogDescription>
                      보유중인 쿠폰번호를 입력해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    autoFocus
                    value={_couponNumber}
                    className='w-full'
                    onChange={(e) => _setCouponNumber(e.target.value)}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type='button' variant={'outline'}>
                        닫기
                      </Button>
                    </DialogClose>
                    <Button type='button' onClick={handleCouponSubmit}>
                      등록하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className='space-y-2 pt-4'>
            <p className='font-semibold'>구매관련 유의사항</p>
            <p className='space-y-2 text-sm text-red-500'>
              - 온라인 컨텐츠 제품의 특성상 구매와 동시에 상품성이 소진되는
              상품이므로 단순 변심에 대한 취소는 불가능 합니다.
            </p>
            <p className='space-y-2 text-sm text-red-500'>
              - 다만 회사(그리날다)가 규정된 기간 내에 서비스를 제공하지 못할시
              회사 내규에 따라 환불절차를 따릅니다.
            </p>
          </div>
          <div className='space-y-4 pt-4'>
            <div className='space-y-2'>
              <p className='font-semibold'>개인정보 수집/이용 동의</p>
              <p className='text-sm'>
                고객님께서는 아래 내용에 대하여 동의를 거부하실 수 있으며, 거부
                시 구매 및 결제, 상품의 이용이 제한됩니다.
              </p>
            </div>
            <table className='w-full border-collapse text-sm text-neutral-600'>
              <thead className='bg-neutral-50'>
                <tr>
                  <th className='border p-1'>수집이용목적</th>
                  <th className='w-1/6 border p-1'>수집항목</th>
                  <th className='w-2/3 border p-1'>보유기간</th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                <tr>
                  <td className='border p-1'>
                    대금 결제/환불 서비스 제공, 주문/거래 내역 조회 서비스 제공,
                    전자상거래법 준수 등
                  </td>
                  <td className='border p-1'>
                    신용카드 정보, 계좌 정보, 주문/거래 내역
                  </td>
                  <td className='border p-2'>
                    고객님의 개인정보는 서비스를 제공하는 기간 동안 보유 및
                    이용하며, 개인정보의 수집 및 이용목적이 달성되면 지체없이
                    파기합니다. 다만, 관계법령의 규정 및 내부지침에 의하여
                    고객님의 개인정보를 보관할 필요성이 있는 경우에는 아래와
                    같이 고객님의 개인정보를 보관할 수 있으며, 이 경우 해당
                    개인정보는 보관의 목적으로만 이용합니다
                    <div className='mt-1 text-blue-600'>
                      가. 개별적으로 고객님의 동의를 받은 경우: 약속한 보유기간
                      <br />
                      나. 통신사실확인자료 제공 시 필요한 로그기록자료, IP주소
                      등 : 3개월(통신비밀보호법)
                      <br />
                      다. 계약 또는 청약철회 등에 관한 기록 : 5년(전자상거래법)
                      <br />
                      라. 대금결제 및 재화 등의 공급에 관한 기록 :
                      5년(전자상거래법)
                      <br />
                      마. 소비자의 불만 또는 분쟁처리에 관한 기록 :
                      3년(전자상거래법)
                      <br />
                      바. 서비스제공과 관련된 문의사항 응대를 위해
                      서비스사용로그: 서비스 종료 후 1개월(회사방침)
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className='border p-2' colSpan={3}>
                    이용계약(이용약관)이 존속중인(탈퇴하지 않은) 회원의 경우
                    보유기간은 보존의무기간 이상 보관할 수 있으며 이 기간이
                    경과된 기록에 대해서 파기요청이 있는 경우 파기함. 결제수단에
                    따른 개인정보 수집.이용 항목이 상이할 수 있음
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='mx-auto w-full max-w-sm shrink-0'>
          <div className='space-y-4 rounded-md border p-4'>
            <p className='text-lg font-semibold'>최종 결제 정보</p>
            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-2'>
                <p className='shrink-0 text-sm text-foreground/60'>
                  서비스기간
                </p>
                <p>{product.subText}</p>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p className='shrink-0 text-sm text-foreground/60'>상품금액</p>
                <p>{formatPrice(Number(product.price))}</p>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p className='shrink-0 text-sm text-foreground/60'>할인금액</p>
                <p>- {formatPrice(discountAmount)}</p>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p className='shrink-0 text-sm text-foreground/60'>
                  최종결제금액
                </p>
                <p className='font-semibold text-primary'>
                  {formatPrice(Number(product.price) - discountAmount)}
                </p>
              </div>
            </div>
            <div className='flex items-start space-x-2 rounded-md border border-neutral-200 bg-neutral-50 p-4'>
              <Checkbox
                id='terms'
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                className='mt-1 h-5 w-5 rounded border-neutral-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
              />
              <div className='space-y-1'>
                <label
                  htmlFor='terms'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  네, 동의 후 구매합니다.
                </label>
                <p className='text-xs text-neutral-500'>
                  해당 내용을 확인하였으며, 결제에 동의합니다.
                </p>
              </div>
            </div>
            <Button
              className='w-full'
              disabled={!isAgreed}
              onClick={handlePayment}
            >
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
