from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from typing import Dict, Any
from app.utils import GradeParser, PDFValidator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware  # 이 줄 추가

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='''
[%(asctime)s] %(levelname)-8s
─────────────────────────────────
%(message)s
''',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.FileHandler('api.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Rate Limiter 설정
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="School Record Parser",
    description="생활기록부 성적 정보 파싱 API",
    version="1.0.0"
)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://chungsaai.com", "http://43.201.25.72", "https://www.chungsaai.com"],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


# Rate Limit 예외 처리기 등록
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    request_id = datetime.now().strftime('%Y%m%d%H%M%S%f')
    
    # request.state에 request_id 설정
    setattr(request.state, "request_id", request_id)
    
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # 요청 정보 로깅
    logger.info(
        f'''[요청 정보]
요청 ID: {request_id}
방식: {request.method}
경로: {request.url.path}
클라이언트 IP: {request.client.host}
처리시간: {process_time:.3f}초'''
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = request_id
    return response

@app.get("/")
@limiter.limit("60/minute")
async def root(request: Request):
    start_time = time.time()
    response = {"message": "안녕하세요!"}
    process_time = time.time() - start_time
    
    logger.info(
        f'''[루트 엔드포인트]
처리시간: {process_time:.3f}초'''
    )
    
    return response

@app.post("/api/parse-grades")
@limiter.limit("10/minute")
async def parse_school_grades(request: Request, file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    PDF 형식의 생활기록부에서 성적 정보를 추출합니다.
    """
    start_time = time.time()
    request_id = getattr(request.state, "request_id", datetime.now().strftime('%Y%m%d%H%M%S%f'))
    
    logger.info(
        f'''[PDF 처리 시작]
요청 ID: {request_id}
파일명: {file.filename}
클라이언트 IP: {request.client.host}'''
    )
    
    try:
        await PDFValidator.validate_pdf(file)
        
        parser = GradeParser()
        pdf_content = await file.read()
        text = parser.extract_text_from_pdf(pdf_content)
        grades_data = await parser.parse_grades(text)
        
        process_time = time.time() - start_time
        logger.info(
            f'''[PDF 처리 완료]
요청 ID: {request_id}
파일명: {file.filename}
파일크기: {len(pdf_content):,} 바이트
처리시간: {process_time:.3f}초'''
        )
        
        return {
            "status": "success",
            "message": "성적 정보 파싱 완료",
            "data": grades_data,
        }
    
    except HTTPException as he:
        process_time = time.time() - start_time
        logger.error(
            f'''[HTTP 오류]
요청 ID: {request_id}
파일명: {file.filename}
오류내용: {he.detail}
처리시간: {process_time:.3f}초'''
        )
        return {
            "status": "error",
            "message": he.detail,
            "data": None,
        }
    
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f'''[예상치 못한 오류]
요청 ID: {request_id}
파일명: {file.filename}
오류내용: {str(e)}
처리시간: {process_time:.3f}초'''
        )
        return {
            "status": "error",
            "message": str(e),
            "data": None,
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)