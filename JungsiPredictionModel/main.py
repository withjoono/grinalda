"""
정시 합격 예측 시스템 - 메인 엔트리포인트
"""
import asyncio
import argparse
import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).parent))


def run_api():
    """API 서버 실행"""
    import uvicorn
    from config.settings import get_settings

    settings = get_settings()
    uvicorn.run(
        "src.api.app:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info",
    )


async def run_crawler(year: int = 2025, sources: list = None):
    """크롤러 실행"""
    from src.crawlers.crawler_manager import CrawlerManager
    from src.utils.logger import log

    log.info(f"크롤러 실행: {year}년도, 소스: {sources or '전체'}")

    manager = CrawlerManager()
    await manager.initialize()

    try:
        results = await manager.crawl_all(year, sources=sources)
        log.info(f"크롤링 완료: {sum(len(r) for r in results.values())}개 데이터 수집")
        return results
    finally:
        await manager.close()


async def run_rag_indexing(days: int = 7):
    """RAG 인덱싱 실행"""
    from src.rag.rag_pipeline import RAGPipeline
    from src.utils.logger import log

    log.info(f"RAG 인덱싱 시작: 최근 {days}일 데이터")

    pipeline = RAGPipeline(use_local=True)
    await pipeline.initialize()

    # 뉴스 인덱싱
    await pipeline.index_news(days=days)

    # 커뮤니티 인덱싱
    await pipeline.index_community()

    log.info("RAG 인덱싱 완료")


def run_training(use_sample: bool = True):
    """모델 학습 실행"""
    from src.ml.trainer import ModelTrainer
    from src.utils.logger import log

    log.info("모델 학습 시작")

    trainer = ModelTrainer()
    results = trainer.run_full_pipeline([], use_sample_data=use_sample)

    log.info(f"학습 완료: {results}")
    return results


def run_prediction_demo():
    """예측 데모 실행"""
    from src.ml.predictor import AdmissionPredictor
    from src.ml.features import StudentScore, DepartmentInfo
    from src.utils.logger import log

    log.info("예측 데모 실행")

    predictor = AdmissionPredictor()

    # 샘플 학생 성적
    student = StudentScore(
        korean_standard=135,
        math_standard=140,
        english_grade=2,
        inquiry1_standard=68,
        inquiry2_standard=65,
        korean_percentile=92,
        math_percentile=95,
        inquiry1_percentile=94,
        inquiry2_percentile=91,
        math_type="미적분",
        inquiry_type="과탐",
    )

    # 샘플 학과 목록
    departments = [
        DepartmentInfo(
            university="연세대학교",
            department="경영학과",
            tier="sky",
            category="인문",
            selection_type="가군",
        ),
        DepartmentInfo(
            university="고려대학교",
            department="경영학과",
            tier="sky",
            category="인문",
            selection_type="나군",
        ),
        DepartmentInfo(
            university="성균관대학교",
            department="경영학과",
            tier="top10",
            category="인문",
            selection_type="가군",
        ),
    ]

    # 예측 수행
    results = predictor.predict_multiple(student, departments)

    print("\n" + "="*60)
    print("합격 예측 결과")
    print("="*60)

    for result in results:
        print(f"\n{result.university} {result.department}")
        print(f"  합격 확률: {result.probability:.1%}")
        print(f"  신뢰구간: {result.probability_lower:.1%} ~ {result.probability_upper:.1%}")
        print(f"  추천: {result.recommendation}")
        print(f"  신뢰도: {result.confidence:.1%}")

    # 최적 조합 추천
    optimal = predictor.suggest_optimal_choices(student, departments)
    print("\n" + "-"*60)
    print(f"추천 전략: {optimal['전략']}")
    print("추천 조합:")
    for r in optimal["추천_조합"]:
        print(f"  - {r.university} {r.department}: {r.probability:.1%} ({r.recommendation})")


async def run_rag_demo():
    """RAG 데모 실행"""
    from src.rag.rag_pipeline import RAGPipeline, RAGQuery
    from src.utils.logger import log

    log.info("RAG 데모 실행")

    pipeline = RAGPipeline(use_local=True)
    await pipeline.initialize()

    # 샘플 질의
    queries = [
        RAGQuery(
            question="올해 연세대 경영학과 경쟁률은 어떤가요?",
            university="연세대학교",
        ),
        RAGQuery(
            question="의대 정시 경쟁률이 높은 학교는?",
        ),
    ]

    print("\n" + "="*60)
    print("RAG 질의응답 데모")
    print("="*60)

    for query in queries:
        print(f"\n질문: {query.question}")
        response = await pipeline.query(query)
        print(f"답변: {response.answer}")
        print(f"신뢰도: {response.confidence:.1%}")


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description="정시 합격 예측 시스템",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python main.py api              # API 서버 실행
  python main.py crawl            # 크롤러 실행
  python main.py crawl --year 2025 --sources adiga jinhak
  python main.py index            # RAG 인덱싱
  python main.py train            # 모델 학습
  python main.py demo             # 예측 데모
  python main.py rag-demo         # RAG 데모
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="실행할 명령")

    # API 서버
    api_parser = subparsers.add_parser("api", help="API 서버 실행")

    # 크롤러
    crawl_parser = subparsers.add_parser("crawl", help="경쟁률 크롤링")
    crawl_parser.add_argument("--year", type=int, default=2025, help="연도")
    crawl_parser.add_argument("--sources", nargs="+", help="소스 (adiga/jinhak/uway)")

    # RAG 인덱싱
    index_parser = subparsers.add_parser("index", help="RAG 데이터 인덱싱")
    index_parser.add_argument("--days", type=int, default=7, help="수집 기간 (일)")

    # 모델 학습
    train_parser = subparsers.add_parser("train", help="모델 학습")
    train_parser.add_argument("--sample", action="store_true", help="샘플 데이터 사용")

    # 데모
    demo_parser = subparsers.add_parser("demo", help="예측 데모 실행")
    rag_demo_parser = subparsers.add_parser("rag-demo", help="RAG 데모 실행")

    args = parser.parse_args()

    if args.command == "api":
        run_api()
    elif args.command == "crawl":
        asyncio.run(run_crawler(args.year, args.sources))
    elif args.command == "index":
        asyncio.run(run_rag_indexing(args.days))
    elif args.command == "train":
        run_training(use_sample=True)
    elif args.command == "demo":
        run_prediction_demo()
    elif args.command == "rag-demo":
        asyncio.run(run_rag_demo())
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
