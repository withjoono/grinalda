/**
 * 블로그 포스트 데이터
 * - WordPress(grinalda.net) 기반의 외부 콘텐츠
 * - 서버 API가 없으므로 정적 데이터로 관리
 * - 추후 WordPress REST API 연동 시 이 파일을 제거할 수 있음
 */
export const BlogPostData: {
    id: string;
    title: string;
    summary: string;
    label: string;
    author: string;
    published: string;
    href: string;
    image: string;
}[] = [
        {
            id: 'post-1',
            title: '[27·28학년도] 조소입시 설명회—박샘다비드에서 함께 해요',
            summary:
                '조소 계열 지망생 분들 주목! 조소전문으로 유명한 박샘다비드 학원에서 입시설명회를 개최합니다. 실기시험 준비부터 합격 전략까지 상세히 알려드립니다.',
            label: '입시설명회',
            author: '박샘다비드',
            published: '2024.11.12',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/11/박샘다비드-조소미대입시설명회-1.png',
        },
        {
            id: 'post-2',
            title: '[2025학년도] 그리날다 전국 미술대학 정시 모집요강 발간!',
            summary:
                '2025학년도 전국 미술대학 정시모집 요강이 발간되었습니다. 주요 미술대학의 최신 입시 전형을 한눈에 비교하고 분석할 수 있습니다.',
            label: '입시정보',
            author: '그리날다',
            published: '2024.11.12',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/10/2025학년도-미술대학-정시-모집요강-정보집_1-1024x1024.jpg',
        },
        {
            id: 'post-3',
            title: '[2025학년도] 고려대반 발상과표현 원데이클래스 모집',
            summary:
                '고려대학교 디자인조형학부 지망생을 위한 특별 원데이클래스를 개최합니다. 실전 연습과 함께 합격생의 노하우를 전수받을 수 있는 기회!',
            label: '실기준비',
            author: '천년의미소',
            published: '2024.11.12',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/10/2410서초강남_고대반원데이클래스_모바일_02-819x1024.jpg',
        },
        {
            id: 'post-4',
            title: '[강남미대입시설명회] 미대로 가는 최단코스',
            summary:
                '강남 천년의미소 미술학원에서 미대 입시 설명회를 개최합니다. 수시/정시 전형 분석부터 실기 준비 전략까지 상세히 알려드립니다.',
            label: '입시설명회',
            author: '천년의미소',
            published: '2024.04.29',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/04/2404강남천미_입시설명회_모바일01-1024x1024.jpg',
        },
        {
            id: 'post-5',
            title: '[ 대치더봄 미술학원 미대입시설명회] 미대학종 토크 콘서트',
            summary:
                '학생부종합 전형 합격 비법 대공개! 깜깜한 미대입시, 불확실한 미대 학종.. 다가올 미대 수시가 두려운 학생&학부모님들을 위한 설명회입니다.',
            label: '입시설명회',
            author: '대치더봄',
            published: '2024.04.29',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/04/대치더봄미술학원_2024한예종-입시설명회-2-1024x1024.jpg',
        },
        {
            id: 'post-6',
            title: '[2025학년도] 홍익대 미술대학 수시 면접대비 컨설팅',
            summary:
                '홍익대학교 미술대학 수시모집 면접을 준비하는 수험생들을 위한 1:1 맞춤형 컨설팅을 진행합니다. 실제 면접 상황을 가정한 모의면접까지!',
            label: '입시컨설팅',
            author: '그리날다',
            published: '2024.11.12',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/10/2025학년도-홍익대-수시-면접대비-컨설팅-1-1024x1024.jpg',
        },
        {
            id: 'post-7',
            title: '[2025-2026학년도] 강남입시미술학원연합회 입시설명회',
            summary:
                '매년 변화하는 미대입시에 길을 잃은 분들을 위해 강남입시미술학원연합회가 준비한 특별한 입시설명회에 여러분을 초대합니다.',
            label: '입시설명회',
            author: '그리날다',
            published: '2024.06.21',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/06/2024강남입시미술연합_입시설명회_카드뉴스-1-1024x1024.png',
        },
        {
            id: 'post-8',
            title: '[2026학년도] 미대 입학전형 시행계획 입학정보집 구매 안내',
            summary:
                '2026학년도 미대 새내기를 위해 그리날다가 야심차게 준비한 "2026학년도 미술대학 입학시행계획" 정보집을 완벽하게 정리했습니다.',
            label: '입시정보',
            author: '그리날다',
            published: '2024.11.12',
            href: '#',
            image:
                'https://grinalda.net/wp-content/uploads/2024/10/2025학년도-미술대학-정시-모집요강-정보집_1-1024x1024.jpg',
        },
    ];
