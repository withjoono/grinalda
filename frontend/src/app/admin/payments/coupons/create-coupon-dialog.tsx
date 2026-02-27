'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCreateCoupon } from '@/apis/hooks/admin/use-admin-coupons';
import { Switch } from '@/components/ui/switch';
import { AdminProduct } from '@/apis/hooks/admin/use-admin-products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export const CreateCouponDialog = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products: AdminProduct[];
}) => {
  const { mutateAsync: createCoupon } = useCreateCoupon();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [productId, setProductId] = useState<number | undefined>(undefined);

  const handleCreate = async () => {
    if (name === '') {
      toast.error('쿠폰명을 입력해주세요.');
      return;
    }
    if (!productId) {
      toast.error('상품을 선택해주세요.');
      return;
    }
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (!selectedProduct) {
      toast.error('상품을 선택해주세요.');
      return;
    }
    if (selectedProduct.price < discountAmount) {
      toast.error('할인금액이 상품 가격보다 클 수 없습니다.');
      return;
    }
    try {
      await createCoupon({
        name,
        memo,
        discountAmount,
        quantity,
        isDeleted,
        productId,
      });
      toast.success('쿠폰이 생성되었습니다.');
      setShowDialog(false);
      setName('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('쿠폰 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>쿠폰 추가</DialogTitle>
          <DialogDescription>
            새로운 쿠폰을 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              쿠폰명
            </Label>
            <div className='col-span-3'>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className='text-xs text-gray-500'>
                쿠폰입력 시 유저에게 표시됩니다.
              </p>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='memo' className='text-right'>
              메모
            </Label>
            <div className='col-span-3'>
              <Input
                id='memo'
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <p className='text-xs text-gray-500'>어드민용 메모</p>
            </div>
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='discountAmount' className='text-right'>
              할인금액
            </Label>
            <Input
              id='discountAmount'
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className='col-span-3'
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='quantity' className='text-right'>
              수량
            </Label>
            <Input
              id='quantity'
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='productId' className='text-right'>
              상품 선택
            </Label>
            <div className='col-span-3'>
              <Select
                value={productId?.toString()}
                onValueChange={(value) => setProductId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='상품 선택' />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.id}. {product.name} ({formatPrice(product.price)}
                      원)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='isDeleted' className='text-right'>
              삭제여부
            </Label>
            <Switch
              id='isDeleted'
              checked={isDeleted}
              onCheckedChange={(e) => setIsDeleted(e)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setShowDialog(false)}>
            취소
          </Button>
          <Button onClick={handleCreate}>추가하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
