from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    avatar_url: Optional[str] = None

class User(UserBase):
    id: str
    hashed_password: str
    role: UserRole
    created_at: datetime
    avatar_url: Optional[str] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

class LessonBase(BaseModel):
    title: str
    description: str
    video_url: Optional[str] = None
    duration_minutes: int = 0
    order: int
    downloadable_materials: List[str] = []

class LessonCreate(LessonBase):
    pass

class Lesson(LessonBase):
    id: str
    course_id: str

class CourseBase(BaseModel):
    title: str
    description: str
    short_description: str
    price: float
    thumbnail_url: str
    category: str
    level: str
    instructor_name: str
    instructor_bio: str
    instructor_avatar: Optional[str] = None
    is_published: bool = True

class CourseCreate(CourseBase):
    lessons: List[LessonCreate] = []

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    thumbnail_url: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    instructor_name: Optional[str] = None
    instructor_bio: Optional[str] = None
    instructor_avatar: Optional[str] = None
    is_published: Optional[bool] = None

class Course(CourseBase):
    id: str
    created_at: datetime
    lessons: List[Lesson] = []
    enrolled_count: int = 0

class CourseListResponse(BaseModel):
    id: str
    title: str
    short_description: str
    price: float
    thumbnail_url: str
    category: str
    level: str
    instructor_name: str
    enrolled_count: int
    lessons_count: int

class EnrollmentBase(BaseModel):
    user_id: str
    course_id: str

class Enrollment(EnrollmentBase):
    id: str
    enrolled_at: datetime
    progress: float = 0.0
    completed_lessons: List[str] = []

class EnrollmentResponse(BaseModel):
    id: str
    course: CourseListResponse
    enrolled_at: datetime
    progress: float
    completed_lessons: List[str]

class PaymentBase(BaseModel):
    user_id: str
    course_id: str
    amount: float

class Payment(PaymentBase):
    id: str
    stripe_payment_intent_id: str
    status: str
    created_at: datetime

class CreateCheckoutSession(BaseModel):
    course_id: str

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    course_id: Optional[str] = None
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str

class LessonProgress(BaseModel):
    lesson_id: str
    course_id: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
