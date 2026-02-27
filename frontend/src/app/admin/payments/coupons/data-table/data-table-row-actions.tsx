'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Coupon } from '@/apis/hooks/admin/use-admin-coupons';
import { EditCouponDialog } from '../edit-coupon-dialog';
import { AdminProduct } from '@/apis/hooks/admin/use-admin-products';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  products: AdminProduct[];
}

export function DataTableRowActions<TData>({
  row,
  products,
}: DataTableRowActionsProps<TData>) {
  const coupon = row.original as Coupon;
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal />
            <span className='sr-only'>메뉴열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => setShowEditDialog(true)}
          >
            수정
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCouponDialog
        coupon={coupon}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        products={products}
      />
    </>
  );
}
