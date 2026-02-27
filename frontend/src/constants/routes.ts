import { match } from 'path-to-regexp';

export const ApiRoutes = {
  AUTH: {
    LOGIN: '/accounts/login',
    LOGOUT: '/accounts/logout',
    REFRESH: '/accounts/refresh',
    REGISTER: '/accounts/register',
    CHANGE_PASSWORD: '/accounts/change-password',
    UPDATE_MARKETING_CONSENT: '/accounts/marketing-consent',
    GET_TERMS_AGREEMENT: '/accounts/terms-agreement',
  },
  USER: {
    ME: '/users/me',
    BOOKMARKS: '/bookmarks',
    ADD_BOOKMARK: '/bookmarks/:earlyAdmissionId',
    DELETE_BOOKMARK: '/bookmarks/:earlyAdmissionId',
    PRE_APPLY_IDS: '/pre-applies/ids',
    ADD_PRE_APPLY: '/pre-applies/:earlyAdmissionId',
    DELETE_PRE_APPLY: '/pre-applies/:earlyAdmissionId',
    PRE_APPLY: '/pre-applies/:earlyAdmissionId',
  },
  DATA: {
    REGIONS: '/regions',
    UNIVERSITIES: '/universities',
    SEARCH_TAGS: '/search-tags',
    ADMISSION_TYPES: '/admission-types',
    EARLY_ADMISSIONS: '/early-admissions',
    EARLY_ADMISSION_DETAIL: '/early-admissions/:id',
    SCHOOL_SUBJECTS: '/school-subjects',
    PRODUCTS: '/products/active',
  },
  BOARDS: {
    FAQ: '/faq',
    FAQ_DETAIL: '/faq/:id',
    NOTICE_CATEGORY: '/notice-categories',
    NOTICE: '/notices',
    NOTICE_DETAIL: '/notices/:id',
    POPUP_ACTIVE: '/popups/active',
    MY_INQUIRY: '/inquiries/my',
    CREATE_INQUIRY: '/inquiries',
    UPDATE_INQUIRY: '/inquiries/:id',
    DELETE_INQUIRY: '/inquiries/:id',
  },
  EVALUATION: {
    TEACHERS: '/evaluations/teachers',
  },
  SCHOOL_RECORD: {
    SAVE: '/school-records/me',
    GET: '/school-records/me',
    DELETE: '/school-records/me',
    PARSE: '/school-records/parse/pdf',
  },
  PAYMENTS: {
    HISTORY: '/payments/history',
    ACTIVE_SUBSCRIPTIONS: '/payments/subscriptions/active',
    CHECK_COUPON: '/coupons/check',
    FREE_PAYMENT: '/payments/free',
    PREPARE: '/payments/prepare',
  },
} as const;

export const AdminApiRoutes = {
  ACCOUNTS: {
    ALL: '/admin/accounts',
    DETAIL: '/admin/accounts/:id',
    UPDATE: '/admin/accounts/:id',
  },
  DATA: {
    REGIONS: {
      CREATE: '/regions',
      UPDATE: '/regions/:id',
      DELETE: '/regions/:id',
    },
    SEARCH_TAGS: {
      CREATE: '/search-tags',
      UPDATE: '/search-tags/:id',
      DELETE: '/search-tags/:id',
    },
    ADMISSION_TYPES: {
      CREATE: '/admission-types',
      UPDATE: '/admission-types/:id',
      DELETE: '/admission-types/:id',
    },
    UNIVERSITIES: {
      CREATE: '/universities',
      UPDATE: '/universities/:id',
      DELETE: '/universities/:id',
    },
    EARLY_ADMISSIONS: {
      CREATE: '/early-admissions',
      UPDATE: '/early-admissions/:id',
      DELETE: '/early-admissions/:id',
    },
    SCHOOL_SUBJECT_GROUPS: {
      CREATE: '/school-subjects/groups',
      UPDATE: '/school-subjects/groups/:id',
      DELETE: '/school-subjects/groups/:id',
    },
    SCHOOL_SUBJECTS: {
      CREATE: '/school-subjects/subjects',
      UPDATE: '/school-subjects/subjects/:id',
      DELETE: '/school-subjects/subjects/:id',
    },
    PRODUCTS: {
      GET: '/products',
      CREATE: '/products',
      UPDATE: '/products/:id',
      DELETE: '/products/:id',
    },
    COUPONS: {
      GET: '/coupons',
      CREATE: '/coupons',
      UPDATE: '/coupons/:id',
      DELETE: '/coupons/:id',
    },
    PAYMENTS: {
      GET: '/payments/admin',
    },
  },

  STATISTICS: {
    RECENT_PAYMENTS: '/admin/statistics/recent-payments',
    SIGNUPS: '/admin/statistics/signups',
    SALES: '/admin/statistics/sales',
    PENDING_INQUIRIES: '/admin/statistics/pending-inquiries',
    ACTIVE_SUBSCRIPTIONS: '/admin/statistics/active-subscriptions',
  },
  BOARDS: {
    FAQ: {
      CREATE: '/faq',
      UPDATE: '/faq/:id',
      DELETE: '/faq/:id',
    },
    NOTICE: {
      CREATE: '/notices',
      UPDATE: '/notices/:id',
      DELETE: '/notices/:id',
    },
    NOTICE_CATEGORIES: {
      CREATE: '/notice-categories',
      UPDATE: '/notice-categories/:id',
      DELETE: '/notice-categories/:id',
    },
    POPUP: {
      CREATE: '/popups',
      UPDATE: '/popups/:id',
      DELETE: '/popups/:id',
    },
    INQUIRY: {
      ALL: '/inquiries/admin',
      DETAIL: '/inquiries/:id',
      CREATE: '/inquiries/:id/replies',
      UPDATE: '/inquiries/:id/replies/:replyId',
      DELETE: '/inquiries/:id/replies/:replyId',
    },
  },
} as const;

export const PageRoutes = {
  ERROR: '/error',
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  ABOUT: '/about', // 소개
  PURCHASE: '/purchase', // 구매하기
  PURCHASE_ORDER: '/purchase/:id', // 주문/결제

  APP_MAIN: '/app', // 온라인 수시예측 프로그램
  APP_SCORE_MANAGEMENT: '/app/score-management', // 성적관리 (레거시)
  APP_INPUT_UPLOAD: '/app/input/upload', // 입력 - 업로드
  APP_SUBJECT_ANALYSIS: '/app/subject-analysis', // 교과분석
  APP_SETUK: '/app/non-subject/setuk', // 비교과분석 - 세특
  APP_CREATIVE_ACTIVITY: '/app/non-subject/creative-activity', // 비교과분석 - 창체·행특
  APP_ATTENDANCE: '/app/non-subject/attendance', // 비교과분석 - 출결
  APP_EXPLORE: '/app/explore', // 전형탐색
  APP_BOOKMARK: '/app/bookmark', // 모의지원

  REPORT: '/report/:id', // 수시 리포트

  CONSULTING: '/consulting', // 온라인 컨설팅

  COMMUNITY_NOTICE: '/community/notice', // 공지사항
  COMMUNITY_FAQ: '/community/faq', // 자주묻는질문
  COMMUNITY_INQUIRY: '/community/inquiry', // 1:1문의

  USER_PROFILE: '/settings',
  USER_CHANGE_PASSWORD: '/settings/change-password',
  USER_PAYMENT: '/settings/payment',
  USER_LEAVE: '/settings/leave',

  // ---------- 선생님 ----------
  TEACHER_PROFILE: '/teacher/profile',
  TEACHER_EVALUATION: '/teacher/evaluation',
  TEACHER_EVALUATION_HISTORY: '/teacher/evaluation-history',

  // ---------- 어드민 ----------

  // 대시보드
  ADMIN_DASHBOARD: '/admin/dashboard',

  // 회원 관리
  ADMIN_USERS: '/admin/users', // 학생 사용자

  // 데이터 관리
  ADMIN_REGIONS: '/admin/data/regions', // 지역
  ADMIN_UNIVERSITIES: '/admin/data/universities', // 대학
  ADMIN_SEARCH_TAGS: '/admin/data/search-tags', // 검색태그
  ADMIN_ADMISSION_TYPES: '/admin/data/admission-types', // 전형유형
  ADMIN_EARLY_ADMISSIONS: '/admin/data/early-admissions', // 수시전형
  ADMIN_SUBJECTS: '/admin/data/subjects', // 교과

  // 결제 관리
  ADMIN_PRODUCTS: '/admin/payments/products', // 상품
  ADMIN_COUPONS: '/admin/payments/coupons', // 쿠폰
  ADMIN_PAYMENTS: '/admin/payments/transactions', // 결제/환불 내역

  // 게시판 관리
  ADMIN_COMMUNITY_NOTICE: '/admin/community/notice', // 공지사항
  ADMIN_COMMUNITY_NOTICE_CATEGORY: '/admin/community/notice-category', // 공지사항 카테고리
  ADMIN_COMMUNITY_FAQ: '/admin/community/faq', // FAQ
  ADMIN_COMMUNITY_INQUIRY: '/admin/community/inquiry', // 1:1문의
  ADMIN_COMMUNITY_POPUP: '/admin/community/popup', // 팝업

  // 시스템 관리
  ADMIN_SYSTEM_LOGS: '/admin/system/logs', // 로그
  ADMIN_SYSTEM_SETTINGS: '/admin/system/settings', // 설정
} as const;

export const whiteList = [
  PageRoutes.HOME,
  PageRoutes.LOGIN,
  PageRoutes.SIGNUP,
  PageRoutes.FORGOT_PASSWORD,
  PageRoutes.ABOUT,
  PageRoutes.APP_MAIN,
  PageRoutes.APP_SCORE_MANAGEMENT,
  PageRoutes.APP_INPUT_UPLOAD,
  PageRoutes.APP_SUBJECT_ANALYSIS,
  PageRoutes.APP_SETUK,
  PageRoutes.APP_CREATIVE_ACTIVITY,
  PageRoutes.APP_ATTENDANCE,
  PageRoutes.APP_EXPLORE,
  PageRoutes.APP_BOOKMARK,
  PageRoutes.PURCHASE,
  PageRoutes.COMMUNITY_NOTICE,
  PageRoutes.COMMUNITY_FAQ,
  PageRoutes.COMMUNITY_INQUIRY,
];

export const isWhiteList = (pathname: string) => {
  return whiteList.some((route) => match(route)(pathname));
};
