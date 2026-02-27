'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { Coupon, useUpdateCoupon } from '@/apis/hooks/admin/use-admin-coupons';
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

interface EditCouponDialogProps {
  coupon: Coupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: AdminProduct[];
}

export function EditCouponDialog({
  coupon,
  open,
  onOpenChange,
  products,
}: EditCouponDialogProps) {
  const [editedName, setEditedName] = useState(coupon.name);
  const [editedMemo, setEditedMemo] = useState(coupon.memo);
  const [editedDiscountAmount, setEditedDiscountAmount] = useState(
    coupon.discountAmount
  );
  const [editedQuantity, setEditedQuantity] = useState(coupon.quantity);
  const [editedIsDeleted, setEditedIsDeleted] = useState(coupon.isDeleted);
  const [editedProductId, setEditedProductId] = useState(coupon.product.id);
  const { mutateAsync: updateCoupon } = useUpdateCoupon();

  const handleEdit = async () => {
    try {
      await updateCoupon({
        id: coupon.id,
        name: editedName,
        memo: editedMemo,
        discountAmount: editedDiscountAmount,
        quantity: editedQuantity,
        isDeleted: editedIsDeleted,
        productId: editedProductId,
      });
      toast.success('쿠폰이 수정되었습니다.');
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('쿠폰 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>쿠폰 수정</DialogTitle>
          <DialogDescription>
            쿠폰의 이름을 수정할 수 있습니다.
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
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
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
                value={editedMemo}
                onChange={(e) => setEditedMemo(e.target.value)}
              />
              <p className='text-xs text-gray-500'>어드민용 메모</p>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='discountAmount' className='text-right'>
              할인 금액
            </Label>
            <Input
              id='discountAmount'
              value={editedDiscountAmount}
              onChange={(e) => setEditedDiscountAmount(Number(e.target.value))}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='quantity' className='text-right'>
              수량
            </Label>
            <Input
              id='quantity'
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(Number(e.target.value))}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='productId' className='text-right'>
              상품 선택
            </Label>
            <div className='col-span-3'>
              <Select
                value={editedProductId.toString()}
                onValueChange={(value) => setEditedProductId(Number(value))}
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
              checked={editedIsDeleted}
              onCheckedChange={(e) => setEditedIsDeleted(e)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleEdit}>수정하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
