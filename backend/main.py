
from fastapi import FastAPI, Request, Depends
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import  Session
from database import SessionLocal, engine, Base
import models, schemas
from utils.password_hash import pwd_hash, verify_password
from utils.access_token import create_access_token
from utils.appwrite_client import account, client
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from datetime import timedelta
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests
from config import Config
import jwt
import json, base64
import httpx


Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "8786aee683e7a9ca3964b72121d1597d7adcfc29853bf0755189adc1b5f77da3"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", 
                   "http://127.0.0.1:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, SECRET_KEY)

oauth = OAuth()
oauth.register(
    name = 'google',
    server_metadata_url = 'https://accounts.google.com/.well-known/openid-configuration',
    client_id=Config.GOOGLE_CLIENT_ID,
    client_secret=Config.GOOGLE_CLIENT_ID,
    client_kwargs={
        "scope": "openid email profile",
        
    }
)

FRONTEND_FAILURE = "http://localhost:5173/login"
FRONTEND_SUCCESS = "http://localhost:5173/auth/success"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_data = payload.get("user")
        user_email = user_data.get("email")
        name = user_data.get("name")
        print(user_data)
        if user_email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email")
        db_user = db.query(models.User).filter(models.User.email == user_email).first()
        if db_user is None:
            OAuth_user = models.User(firstname=name,
                           email=user_email,  
            )
            print("new user created")
            db.add(OAuth_user)
            db.commit()
            db.refresh(OAuth_user)
            return OAuth_user
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token")
    
    return db_user

@app.post("/signup", response_model=schemas.UserResponse)
async def signup_users(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise ValueError("Email already registered")
    if user.password != user.confirmPassword:
        raise ValueError("Passwords do not match")
    hashed_pwd = pwd_hash(user.password)
    new_user = models.User(firstname=user.firstname, 
                           lastname=user.lastname, 
                           email=user.email, 
                           password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.UserResponse)
async def login_users(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise ValueError("Email not registered")
    if not verify_password(user.password, db_user.password):
        raise ValueError("Incorrect password")
    
    try:
        access_token = create_access_token(user_data={"email": user.email, 
                                            "firstname": db_user.firstname, 
                                            "id": db_user.id}
        )
        
        refresh_token = create_access_token(user_data={"email": user.email, 
                                            "firstname": db_user.firstname,
                                            "id": db_user.id}, 
                                            
                                            expiry=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS), 
                                            refresh=True)
        return JSONResponse(content={
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": db_user.id,
                "firstname": db_user.firstname,
                "lastname": db_user.lastname,
                "email": db_user.email}
            })
    except Exception as e:
        raise ValueError("Token generation failed") from e

@app.get("/auth/login")
async def google_login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    google_auth_url = f"https://accounts.google.com/o/oauth2/auth?client_id={Config.GOOGLE_CLIENT_ID}&redirect_uri={redirect_uri}&response_type=code&scope=openid email profile"
    return RedirectResponse(url=google_auth_url)

@app.get("/auth/google/callback")
async def auth_callback(code:str, request: Request, db: Session = Depends(get_db)):
    token_request_uri = "https://oauth2.googleapis.com/token"
    data = {
        'code': code,
        'client_id': Config.GOOGLE_CLIENT_ID,
        'client_secret': Config.GOOGLE_SECRET_ID,
        'redirect_uri': request.url_for('auth_callback'),
        'grant_type': 'authorization_code',
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_request_uri, data=data)
        response.raise_for_status()
        token_response = response.json()
        
    id_token_value = token_response.get('id_token')
    if not id_token_value:
        raise HTTPException(status_code=400, detail="Missing id in response")

    try:
        id_info = id_token.verify_oauth2_token(id_token_value, requests.Request(), Config.GOOGLE_CLIENT_ID)
        name = id_info.get('name')
        email = id_info.get('email')
        
        user_data = {
            "name": name,
            "email": email
        }
        
        access_token = create_access_token(user_data)
        refresh_token = create_access_token(user_data, expiry=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS), 
                                            refresh=True)
        
        redirect_url = f"{FRONTEND_SUCCESS}?access_token={access_token}"
        
        response = RedirectResponse(url=redirect_url)
        
        user =  {"firstname": name,
                "email": email}

        encoded = base64.b64encode(json.dumps(user).encode()).decode()

        
        response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,   # ⚠️ keep True in production (HTTPS only)
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
        
        response.set_cookie(
        key="user",
        value=encoded,
        httponly=False,
        secure=True,   # ⚠️ keep True in production (HTTPS only)
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
        
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

    
    
@app.get("/dashboard/feed", response_model=list[schemas.BlogPostResponse])
async def get_blog(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    blogs = db.query(models.BlogPost).all()
    result = []
    
    user_bookmarks = db.query(models.Bookmark.post_id).filter(models.Bookmark.user_id == current_user.id).all()
    bookmarked_post_ids = {bookmark.post_id for bookmark in user_bookmarks}
    
    for blog in blogs:
        
        is_liked = db.query(models.PostLike).filter(models.PostLike.post_id == blog.id, models.PostLike.user_id == current_user.id).first() is not None
        
        result.append(
            schemas.BlogPostResponse(
                id=blog.id,
                title=blog.title,
                content=blog.content,
                excerpt=blog.excerpt,
                category=blog.category.title if blog.category else "Uncategorized",
                author=blog.author.firstname if blog.author else "Unknown",
                authorAvatar=blog.author.avatar_url if blog.author else "",
                createdAt=blog.created_at.isoformat() if blog.created_at else "",
                likes=blog.likes_count,
                is_liked = is_liked,
                comments=blog.comments_count,
                bookmarked=blog.id in bookmarked_post_ids
            )
        )
    return result

@app.get("/dashboard/userposts", response_model=list[schemas.UserBlogPostResponse])
async def get_user_blogs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    blogs = db.query(models.BlogPost).filter(models.BlogPost.author_id == current_user.id).all()
    result = []
    
    for blog in blogs:
        
        result.append(
            schemas.UserBlogPostResponse(
                id=blog.id,
                title=blog.title,
                content=blog.content,
                excerpt=blog.excerpt,
                category=blog.category.title if blog.category else "Uncategorized",
                createdAt=blog.created_at.isoformat() if blog.created_at else "",
                likes=len(blog.likes),
                comments=blog.comments_count,
                isPublished=blog.is_published,
            )
        )
    return result
    
@app.post("/blog/create")
async def create_blog(blog: schemas.BlogPostCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    
    print(blog)
    category = db.query(models.Category).filter(models.Category.title == blog.category).first()
    if not category:
        category = models.Category(title=blog.category)
        db.add(category)
        db.commit()
        db.refresh(category)
        
    new_post = models.BlogPost(
        title=blog.title,
        content=blog.content,
        excerpt=blog.excerpt,
        is_published=True,
        author_id=current_user.id,
        category_id=category.id
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {"message": "Blog post created successfully", "post_id": new_post.id}
        
@app.delete("/blog/delete")
async def delete_blog(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        blog = db.query(models.BlogPost).filter(models.BlogPost.id == id, models.BlogPost.author_id == current_user.id).first()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID") from e
    
    db.delete(blog)
    db.commit()
    
    return {"message": "Blog post deleted successfully"}

@app.put("/blog/edit")
async def edit_blog(id: int, blog: schemas.BlogPostUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        existing_blog = db.query(models.BlogPost).filter(models.BlogPost.id == id, models.BlogPost.author_id == current_user.id).first()
        if not existing_blog:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID") from e
    
    existing_blog.title = blog.title if blog.title is not None else existing_blog.title
    existing_blog.content = blog.content if blog.content is not None else existing_blog.content
    existing_blog.excerpt = blog.excerpt if blog.excerpt is not None else existing_blog.excerpt
    
    if blog.category:
        category = db.query(models.Category).filter(models.Category.title == blog.category).first()
        if not category:
            category = models.Category(title=blog.category)
            db.add(category)
            db.commit()
            db.refresh(category)
            
        existing_blog.category_id = category.id
    db.commit()
    db.refresh(existing_blog)
    
    return {"message": "Blog post updated successfully"}
    
@app.post("/blog/like")
async def like_post(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    existing_like = db.query(models.PostLike).filter(models.PostLike.post_id == id, models.PostLike.user_id == current_user.id).first()
    if existing_like:
        db.delete(existing_like)
        
        db.commit()
        return {"message": "Post unliked"}
    else:
        new_like = models.PostLike(user_id=current_user.id, post_id=id)
        db.add(new_like)
        
        db.commit()
        return {"message": "Post liked"}
    
@app.post("/blog/bookmark")
async def bookmark_post(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    existing_bookmark = db.query(models.Bookmark).filter(models.Bookmark.post_id == id, models.Bookmark.user_id == current_user.id).first()
    if existing_bookmark:
        db.delete(existing_bookmark)
        db.commit()
        return {"message": "Post removed from bookmarks"}
    else:
        new_bookmark = models.Bookmark(user_id=current_user.id, post_id=id)
        db.add(new_bookmark)
        db.commit()
        return {"message": "Post bookmarked"}
    
