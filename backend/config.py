from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    
    database_url: str = os.getenv('database_url')
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    algorithm: str = os.getenv('algorithm')
    access_token_expire_minutes: int = os.getenv('access_token_expire_minutes')
    REFRESH_TOKEN_EXPIRE_DAYS: int = os.getenv('REFRESH_TOKEN_EXPIRE_DAYS')
    
    app_write_project_id: str = os.getenv('APPWRITE_PROJECT_ID')
    APPWRITE_ENDPOINT: str = os.getenv('APPWRITE_ENDPOINT')
    
    GOOGLE_CLIENT_ID:str = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_SECRET_ID:str = os.getenv('GOOGLE_SECRET_ID')
    
    class config:
        env_file = ".env"
    

Config = Settings()

