from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    
    database_url: str = os.getenv('database_url')
    secret_key: str = os.getenv('secret_key')
    algorithm: str = os.getenv('algorithm')
    access_token_expire_minutes: int = os.getenv('access_token_expire_minutes')
    
    app_write_project_id: str = os.getenv('app_write_project_id')
    
    GOOGLE_CLIENT_ID:str = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_SECRET_ID:str = os.getenv('GOOGLE_SECRET_ID')
    
    class config:
        env_file = ".env"
    

Config = Settings()

