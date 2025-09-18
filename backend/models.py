from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, func
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(50), index=True)
    lastname = Column(String(50), index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    avatar_url = Column(String(255), nullable=True)
    
    blogs = relationship("BlogPost", back_populates="author")
    liked = relationship("PostLike", back_populates="user", cascade="all, delete-orphan")
    bookmark = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    
    blogs = relationship("BlogPost", back_populates="category")
    
class BlogPost(Base):
    __tablename__ = "blogposts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    content = Column(String(500), nullable=False)
    excerpt = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_published = Column(Boolean, default=False)
    comments_count = Column(Integer, default=0)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    author_id = Column(Integer, ForeignKey("users.id"))
    
    category = relationship("Category", back_populates="blogs")
    author = relationship("User", back_populates="blogs")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    bookmark = relationship("Bookmark", back_populates="post", cascade="all, delete-orphan")
    
    @property
    def likes_count(self):
        return len(self.likes)
    
class Bookmark(Base):
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("blogposts.id"))
    
    user = relationship("User")
    post = relationship("BlogPost")

class PostLike(Base):
    __tablename__ = "post_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("blogposts.id"))

    user = relationship("User")
    post = relationship("BlogPost")