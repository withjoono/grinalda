from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    MODEL_NAME: str = "gpt-4"
    TEMPERATURE: float = 0
    MAX_TOKENS: int = 4000  # 응답 토큰 제한

    class Config:
        env_file = ".env"

settings = Settings()