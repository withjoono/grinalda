/**
 * [iamport] 상점 코드 조회 API 응답
 */
export interface IGetStoreCodeResponse {
  storeCode: string;
}
/**
 * 결제 사전 등록 API 요청
 */
export interface IPreRegisterPaymentBody {
  product_id: number;
  coupon_number?: string;
}

/**
 * 결제 사전 등록 API 응답
 */
export interface IPreRegisterPaymentResponse {
  merchant_uid: string;
}

/**
 *  무료 결제 API 요청
 */
export interface IContractFreeServiceBody {
  product_id: number;
  coupon_number: string;
}

/**
 *  무료 결제 API 응답
 */
export interface IVerifyPaymentBody {
  imp_uid: string;
  merchant_uid: string;
  coupon_number?: string;
}

/**
 * 쿠폰 유효성 확인 API 요청
 */
export interface IValidCouponBody {
  coupon_number: string;
  product_id: number;
}

/**
 * 쿠폰 유효성 확인 API 응답
 */
export interface IValidCouponResponse {
  discount_price: number;
  coupon_info: string;
}

/**
 * 결제 내역
 */
export interface IPaymentHistory {
  id: number;
  cancel_amount: number | null;
  paid_amount: number | null;
  card_name: string | null;
  card_number: string | null;
  create_dt: Date | null;
  update_dt: Date | null;
  order_state: string;
  pay_service: {
    product_nm: string;
    term: Date | null;
    product_price: string;
  };
}
