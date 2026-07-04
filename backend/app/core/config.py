from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediFed Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./medifed.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
