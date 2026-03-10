export interface IProduct {
  id: number;
  create_dt: Date | null;
  explain_comment: string | null;
  product_image: string | null;
  product_nm: string;
  product_payment_type: string | null;
  product_price: string;
  promotion_discount: number;
  term: Date | null;
  update_dt: Date | null;
  refund_policy: string | null;
  delete_flag: number;
  product_cate_code: string | null;
  product_type_code: string | null;
  service_range_code: string | null;
  available_count: number | null;
  available_term: string | null;
}
