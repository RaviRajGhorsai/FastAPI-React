from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str
    confirmPassword: str
    
class UserResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: EmailStr
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    firstname: str | None = None

class User(BaseModel):
    
    email: EmailStr
    firstname: str
    disabled: bool | None = None
    
class userInDB(User):
    hashed_password: str
    
class BlogPostCreate(BaseModel):
    title: str
    category: str
    content: str
    excerpt: str | None = None
    author: str
    authorEmail: EmailStr
    
class BlogPostResponse(BaseModel):
    id: int
    title: str
    content: str
    excerpt: str
    category: str
    author: str
    authorAvatar: str | None = None
    createdAt: str
    likes: int
    is_liked: bool = False
    comments: int
    bookmarked: bool = False
    
class UserBlogPostResponse(BaseModel):
    id: int
    title: str
    content: str
    excerpt: str
    category: str
    createdAt: str
    likes: int
    comments: int
    isPublished: bool
    
class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    