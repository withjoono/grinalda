/**
 * 앱별 전체 기능 카탈로그 데이터
 *
 * 각 앱의 모든 세부 기능을 열거합니다.
 * /apps/features 페이지에서 사용됩니다.
 */

export interface FeatureItem {
    name: string;
    description: string;
    tag?: "핵심" | "신규" | "연계" | "AI";
}

export interface AppFeatureCatalog {
    appId: string;
    features: FeatureItem[];
}

export const appFeatureCatalog: AppFeatureCatalog[] = [
    // ━━━━━━━━━━ My 생기부 ━━━━━━━━━━
    {
        appId: "mysanggibu",
        features: [
            { name: "생기부 PDF 업로드", description: "학교생활기록부 PDF를 업로드하면 자동으로 파싱 및 항목 분류", tag: "핵심" },
            { name: "교과 성적 관리", description: "내신 등급, 석차, 원점수, 과목별 성적을 통합 관리" },
            { name: "비교과 활동 관리", description: "동아리, 봉사활동, 수상경력, 독서활동 등 비교과 항목 정리" },
            { name: "세부능력특기사항 분석", description: "세특 텍스트 분석으로 과목별 강점·약점 파악" },
            { name: "AI 사정관 평가", description: "AI가 입학사정관 역할로 생기부를 항목별 평가 시뮬레이션", tag: "AI" },
            { name: "대학별 유불리 분석", description: "지원 대학에 맞춰 생기부 항목별 유불리를 정밀 분석 (특허 기술)", tag: "핵심" },
            { name: "교과 등급 추이 그래프", description: "학기별, 과목별 내신 등급 변화를 시각적으로 확인" },
            { name: "생기부 요약 리포트", description: "생기부 전체를 한눈에 파악할 수 있는 요약 리포트 생성" },
            { name: "수시 모의지원 연계", description: "생기부 데이터를 기반으로 수시 모의지원 서비스와 자동 연계", tag: "연계" },
        ],
    },

    // ━━━━━━━━━━ Exam Hub ━━━━━━━━━━
    {
        appId: "examhub",
        features: [
            { name: "모의고사 성적 입력", description: "수능 모의고사 과목별 원점수·등급·백분위를 간편 입력", tag: "핵심" },
            { name: "내신 성적 입력", description: "학교 내신 시험 성적 입력 및 관리" },
            { name: "학원 시험 성적 입력", description: "학원별 시험 성적도 통합 관리 가능" },
            { name: "성적 추이 분석", description: "과목별, 시험별 성적 변화를 그래프로 한눈에 파악", tag: "핵심" },
            { name: "성적 통계", description: "과목별 평균, 최고/최저, 표준편차 등 통계 분석" },
            { name: "오답 관리", description: "틀린 문제를 기록하고 유사 문항으로 반복 학습" },
            { name: "입시 예측 연계", description: "입력한 성적을 기반으로 수시·정시 예측 서비스와 자동 연계", tag: "연계" },
            { name: "목표 대학 설정", description: "목표 대학을 설정하고 필요 등급과 현재 성적 비교" },
            { name: "시험 일정 관리", description: "모의고사, 내신 시험 일정을 달력으로 관리" },
            { name: "과목별 성적 비교", description: "국·수·영·탐 과목별 성적 비교 리포트" },
        ],
    },

    // ━━━━━━━━━━ Study Planner ━━━━━━━━━━
    {
        appId: "studyplanner",
        features: [
            { name: "일일 미션 관리", description: "오늘의 학습 할 일을 체크리스트로 관리하고 달성률 추적", tag: "핵심" },
            { name: "장기 계획 생성", description: "수능까지 남은 날짜에 맞춰 교과서·참고서 분량 자동 생성", tag: "핵심" },
            { name: "주간 루틴 설정", description: "요일별 반복 루틴 설정으로 매주 자동 할 일 생성", tag: "핵심" },
            { name: "학습 통계 & 분석", description: "일별/주별/월별 학습 달성률, 시간, 과목 비율 분석" },
            { name: "집중 타이머", description: "포모도로 기반 25분 집중 + 5분 휴식 타이머", tag: "핵심" },
            { name: "과목별 학습 시간 기록", description: "타이머로 측정한 시간을 과목별로 자동 분류" },
            { name: "선생님 코멘트", description: "계정연동된 선생님이 학습 진도를 확인하고 코멘트 남기기", tag: "연계" },
            { name: "학습 현황 공유", description: "Tutor Board, Study Arena와 학습 현황 실시간 공유", tag: "연계" },
            { name: "교과서/참고서 분량 관리", description: "학습 교재의 페이지 수와 분량을 등록하여 계획에 활용" },
            { name: "미션 우선순위 설정", description: "중요도에 따라 할 일의 우선순위를 설정" },
            { name: "이용권 구매", description: "프리미엄 기능 이용을 위한 결제 시스템" },
        ],
    },

    // ━━━━━━━━━━ Tutor Board ━━━━━━━━━━
    {
        appId: "tutorboard",
        features: [
            { name: "수업 현황표", description: "수업별 커리큘럼, 진도, 과제 현황을 표 형태로 관리", tag: "핵심" },
            { name: "3자 공유 현황표", description: "선생님-학생-학부모가 수업 정보를 실시간 공유", tag: "핵심" },
            { name: "과제 관리", description: "과제 출제, 제출 여부 확인, 미제출자 알림" },
            { name: "테스트 관리", description: "소테스트 출제 및 성적 기록·분석" },
            { name: "수업 타임라인", description: "수업별 진행 내역을 날짜 기반 타임라인으로 열람" },
            { name: "수업 계획 작성", description: "수업별 주차 계획 및 커리큘럼 작성" },
            { name: "학생 출결 관리", description: "수업별 학생 출석, 지각, 결석 기록" },
            { name: "선생님 대시보드", description: "담당 수업·학생 현황을 한눈에 파악하는 대시보드", tag: "핵심" },
            { name: "학부모 대시보드", description: "자녀의 수업 현황을 학부모가 확인 가능", tag: "연계" },
            { name: "코멘트 & 피드백", description: "수업별로 선생님이 학생/학부모에게 피드백 전달" },
            { name: "Study Planner 연계", description: "학생의 플래너 학습 현황을 수업 현황표에서 확인", tag: "연계" },
        ],
    },

    // ━━━━━━━━━━ Study Arena ━━━━━━━━━━
    {
        appId: "studyarena",
        features: [
            { name: "아레나 홈 대시보드", description: "소속 아레나의 학습 현황과 오늘의 요약을 한눈에 확인", tag: "핵심" },
            { name: "실시간 랭킹", description: "클래스 내 학생들의 일간/주간/월간 학습 성과 순위", tag: "핵심" },
            { name: "학습 배틀", description: "1:1 또는 팀 단위로 학습 성과를 겨루는 배틀 시스템", tag: "핵심" },
            { name: "배틀 상세 분석", description: "배틀 결과에 대한 상세 통계 및 비교 분석" },
            { name: "스터디 그룹", description: "같은 목표의 학생들끼리 스터디 그룹 생성·관리" },
            { name: "그룹 상세 현황", description: "그룹별 학습 현황 및 멤버별 달성률 확인" },
            { name: "아레나 생성 & 참가", description: "새로운 아레나(클래스) 생성 및 초대 코드로 참가" },
            { name: "아레나 상세 관리", description: "아레나 설정, 멤버 관리, 운영 관리" },
            { name: "업적 & 배지 시스템", description: "학습 목표 달성 시 배지와 업적으로 동기 부여", tag: "신규" },
            { name: "리그 시스템", description: "브론즈→실버→골드→다이아 등 리그 승격/강등 시스템", tag: "신규" },
            { name: "성장 통계", description: "개인 학습 성장 추이 및 아레나 내 순위 변화 그래프" },
            { name: "온라인 멤버 표시", description: "현재 학습 중인 멤버를 실시간으로 확인" },
        ],
    },

    // ━━━━━━━━━━ 수시 예측 분석 ━━━━━━━━━━
    {
        appId: "susi",
        features: [
            { name: "교과 성적 분석", description: "내신 등급 기반 종합 교과 경쟁력 분석", tag: "핵심" },
            { name: "교과 등급 입력", description: "학기별, 과목별 내신 등급·석차·원점수 간편 입력" },
            { name: "AI 사정관 평가", description: "AI가 입학사정관 시뮬레이션으로 생기부 항목별 전문 평가", tag: "AI" },
            { name: "대학별 유불리 분석", description: "특허 기술 기반으로 대학별 반영 비율에 따른 유불리 정밀 분석", tag: "핵심" },
            { name: "수시 모의지원", description: "실제 지원 전에 모의지원으로 합격 가능성 사전 확인 (무료)", tag: "핵심" },
            { name: "수시 종합 탐색", description: "대학별 수시 모집전형 탐색 및 비교" },
            { name: "수시 교과 탐색", description: "교과 전형별 대학/학과 탐색 및 필터링" },
            { name: "대학 탐색", description: "대학별 모집요강, 전형 일정, 경쟁률 등 상세 정보 열람" },
            { name: "모집단위 탐색", description: "학과별 전형 정보와 모집 인원 확인" },
            { name: "입학처 정보 연동", description: "각 대학 입학처의 최신 정보와 자동 연동" },
            { name: "논술 분석", description: "논술 전형 대학별 유불리 분석" },
            { name: "학종 요약 리포트", description: "학생부종합 전형 지원을 위한 종합 리포트 제공" },
            { name: "경쟁률 분석", description: "전년도 대비 경쟁률 변화 추이 분석" },
        ],
    },

    // ━━━━━━━━━━ 정시 예측 분석 ━━━━━━━━━━
    {
        appId: "jungsi",
        features: [
            { name: "수능 성적 입력", description: "과목별 원점수, 표준점수, 백분위, 등급 입력", tag: "핵심" },
            { name: "정시 합격 예측", description: "수능 성적 기반 대학별 합격 가능성 예측 분석", tag: "핵심" },
            { name: "대학별 유불리 분석", description: "특허 기술 기반 대학별 반영 비율에 따른 유불리 정밀 분석", tag: "핵심" },
            { name: "군별 조합 시뮬레이션", description: "가/나/다군 조합별 최적 지원 전략 시뮬레이션", tag: "핵심" },
            { name: "관심 대학 관리", description: "관심 대학/학과를 저장하고 합격 가능성 한눈에 비교" },
            { name: "지원 전략 분석", description: "안정/적정/소신 지원 전략 추천" },
            { name: "과목별 반영 비율 분석", description: "대학별 과목 반영 비율에 따른 유불리 계산" },
            { name: "정시 모의지원", description: "모의지원으로 최적의 정시 지원 전략 수립" },
            { name: "계정연동 선생님 상담", description: "연동된 선생님과 정시 분석 결과 공유 및 상담", tag: "연계" },
            { name: "전년도 성적 비교", description: "전년도 합격자 성적과 나의 성적 비교 분석" },
        ],
    },

    // ━━━━━━━━━━ 선생님용 앱 ━━━━━━━━━━
    {
        appId: "teacher-admin",
        features: [
            { name: "학생 목록 관리", description: "담당 학생 목록 관리 및 그룹별 분류", tag: "핵심" },
            { name: "학생 학습 모니터링", description: "학생의 플래너 달성률, 학습 시간을 실시간 확인", tag: "핵심" },
            { name: "학생 성적 현황", description: "학생의 내신·모의고사 성적 추이를 한눈에 파악" },
            { name: "수업 관리 (Tutor Board)", description: "Tutor Board 수업 현황표를 선생님 전용 화면에서 관리", tag: "연계" },
            { name: "과제/테스트 출제", description: "수업별 과제 출제 및 테스트 성적 관리", tag: "연계" },
            { name: "학생 코멘트 남기기", description: "학생의 플래너에 코멘트와 피드백을 남길 수 있음" },
            { name: "학부모 소통", description: "학부모에게 학생 현황 리포트와 코멘트 전달" },
            { name: "계정연동 관리", description: "학생/학부모와의 계정연동 요청 관리" },
            { name: "입시 상담 연계", description: "수시·정시 분석 결과를 학생과 함께 열람하며 상담", tag: "연계" },
            { name: "학습 리포트 생성", description: "학생별 주간/월간 학습 리포트 자동 생성" },
        ],
    },

    // ━━━━━━━━━━ 학부모용 앱 ━━━━━━━━━━
    {
        appId: "parent-admin",
        features: [
            { name: "자녀 학습 모니터링", description: "자녀의 플래너 달성률, 학습 시간, 출결 현황 확인", tag: "핵심" },
            { name: "자녀 성적 열람", description: "자녀의 내신·모의고사 성적과 추이를 한눈에 파악" },
            { name: "생기부 현황 확인", description: "자녀의 생기부 주요 항목과 비교과 활동 확인", tag: "연계" },
            { name: "수업 현황 열람", description: "Tutor Board를 통한 수업 진도, 과제, 테스트 현황 확인", tag: "연계" },
            { name: "선생님 소통", description: "계정연동된 선생님과 비공개 코멘트 교환", tag: "핵심" },
            { name: "Study Arena 팀 구성", description: "자녀를 위한 스터디 그룹/경쟁팀 구성 및 관리", tag: "연계" },
            { name: "학습 리포트 열람", description: "자녀의 주간/월간 학습 리포트 확인" },
            { name: "계정연동 관리", description: "자녀, 선생님과의 계정연동 요청 및 수락 관리" },
            { name: "입시 현황 확인", description: "자녀의 수시·정시 분석 결과를 함께 열람", tag: "연계" },
        ],
    },
];
