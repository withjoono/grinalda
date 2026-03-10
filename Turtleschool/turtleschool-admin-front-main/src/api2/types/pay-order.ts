export interface PayOrder {
  id: number;

  member?: {
    email: string;
    nickname: string;
  };

  cancel_amount: number; // 취소 금액

  emb_pg_provider: string | null; // PG사 제공자

  card_name: string | null; // 카드명 (ex. 국민카드)

  card_number: string | null; // 카드번호 (ex. 948882*********1)

  contract_id: number | null; // (안씀)

  create_dt: Date | null;

  imp_uid: string; // 아임포트 uid

  member_id: number | null; // 유저 아이디

  merchant_uid: string; // 아임포트 상품 아이디

  order_state: string; // 주문 상태 (COMPLETE, CANCELREQUEST)

  paid_amount: number | null; // 결제 금액

  update_dt: Date | null;

  vbank_code: string | null; // 은행 코드(안씀)

  vbank_name: string | null; // 은행 이름(안씀)

  pay_service_id: number | null; // 구매한 상품 id
}
