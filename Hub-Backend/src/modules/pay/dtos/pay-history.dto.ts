export class PayHistoryDto {
  id: bigint;
  cancel_amount: number;
  paid_amount: number;
  card_name: string;
  create_dt: Date;
  order_state: string;

  pay_service: {
    product_nm: string;
    term: Date;
    product_price: string;
  };
}
