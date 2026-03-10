from typing import Union
from fastapi import UploadFile, HTTPException
from PyPDF2 import PdfReader
import io
import magic

class PDFValidator:
    @staticmethod
    async def validate_file_type(file: UploadFile) -> bool:
        """
        파일 확장자와 MIME 타입을 검사합니다.
        """
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail="PDF 파일만 업로드 가능합니다"
            )
        
        # 파일의 처음 부분을 읽어서 MIME 타입 확인
        file_content = await file.read(2048)  # 처음 2KB만 읽음
        await file.seek(0)  # 파일 포인터를 다시 처음으로
        
        mime = magic.from_buffer(file_content, mime=True)
        if mime != 'application/pdf':
            raise HTTPException(
                status_code=400, 
                detail="유효하지 않은 PDF 파일입니다"
            )
        return True

    @staticmethod
    async def validate_pdf_structure(file_content: bytes) -> bool:
        """
        PDF 파일의 구조를 검사합니다.
        """
        try:
            pdf = PdfReader(io.BytesIO(file_content))
            if len(pdf.pages) == 0:
                raise HTTPException(
                    status_code=400, 
                    detail="빈 PDF 파일입니다"
                )
            return True
        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"PDF 파일 구조가 손상되었습니다: {str(e)}"
            )

    @staticmethod
    async def validate_file_size(file: UploadFile, max_size: int = 10 * 1024 * 1024) -> bool:
        """
        파일 크기를 검사합니다. 기본 최대 크기는 10MB입니다.
        """
        file_size = 0
        content = await file.read()
        await file.seek(0)
        
        file_size = len(content)
        if file_size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"파일 크기는 {max_size/1024/1024}MB를 초과할 수 없습니다"
            )
        return True

    @classmethod
    async def validate_pdf(cls, file: UploadFile) -> Union[bool, HTTPException]:
        """
        모든 PDF 검증을 수행합니다.
        """
        await cls.validate_file_type(file)
        await cls.validate_file_size(file)
        content = await file.read()
        await file.seek(0)
        await cls.validate_pdf_structure(content)
        return True