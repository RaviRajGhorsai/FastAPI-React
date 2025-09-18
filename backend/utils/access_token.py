from datetime import datetime, timedelta
import jwt
from config import Config
import uuid
import logging

def create_access_token(user_data: dict, expiry: timedelta = None, refresh: bool = False):
    payload = {}
    payload['user'] = user_data
    payload['exp'] = datetime.now() + (expiry if expiry is not None else timedelta(minutes=Config.access_token_expire_minutes))
    
    payload['jti'] = str(uuid.uuid4())
    payload['refresh'] = refresh
    token = jwt.encode(payload, key=Config.secret_key, algorithm=Config.algorithm)
    
    return token

def decode_token(token: str):
    try:
        token_data = jwt.decode(token,
                            key=Config.secret_key,
                            algorithm=Config.algorithm)
        return token_data
    except jwt.pyJWTError as e:
        logging.exception(f"Token decoding error: {e}")
        return None