from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv
import stripe
import secrets
from datetime import datetime, timedelta

from app.models import (
    UserCreate, UserLogin, UserResponse, TokenResponse, User, UserRole,
    PasswordResetRequest, PasswordReset,
    CourseCreate, CourseUpdate, Course, CourseListResponse, Lesson, LessonCreate,
    Enrollment, EnrollmentResponse,
    CreateCheckoutSession, CheckoutSessionResponse,
    ChatRequest, ChatResponse,
    LessonProgress, ContactForm
)
from app.database import (
    get_user_by_email, get_user_by_id, create_user, verify_password,
    get_course_by_id, get_all_courses, create_course, update_course, delete_course,
    add_lesson_to_course, update_lesson, delete_lesson,
    get_enrollment, get_user_enrollments, create_enrollment, update_enrollment_progress,
    create_payment, get_payment_by_stripe_id, update_payment_status,
    users_db, courses_db
)
from app.auth import create_access_token, get_current_user, get_current_user_optional, require_admin

load_dotenv()

app = FastAPI(title="Virtual IT Labs API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# Auth endpoints
@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = create_user(
        email=user_data.email,
        name=user_data.name,
        password=user_data.password
    )
    
    token = create_access_token(user.id)
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
            avatar_url=user.avatar_url
        )
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(user.id)
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
            avatar_url=user.avatar_url
        )
    )

@app.post("/api/auth/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    user = get_user_by_email(request.email)
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        users_db[user.id] = user
    return {"message": "If the email exists, a reset link has been sent"}

@app.post("/api/auth/reset-password")
async def reset_password(request: PasswordReset):
    for user in users_db.values():
        if user.reset_token == request.token:
            if user.reset_token_expiry and user.reset_token_expiry > datetime.utcnow():
                from app.database import hash_password
                user.hashed_password = hash_password(request.new_password)
                user.reset_token = None
                user.reset_token_expiry = None
                users_db[user.id] = user
                return {"message": "Password reset successful"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Reset token has expired"
                )
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid reset token"
    )

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url
    )

@app.put("/api/auth/profile", response_model=UserResponse)
async def update_profile(
    name: Optional[str] = None,
    avatar_url: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    if name:
        current_user.name = name
    if avatar_url:
        current_user.avatar_url = avatar_url
    users_db[current_user.id] = current_user
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url
    )

# Course endpoints
@app.get("/api/courses", response_model=List[CourseListResponse])
async def list_courses(
    category: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    courses = get_all_courses(published_only=True)
    
    if category:
        courses = [c for c in courses if c.category.lower() == category.lower()]
    
    if level:
        courses = [c for c in courses if c.level.lower() == level.lower()]
    
    if search:
        search_lower = search.lower()
        courses = [c for c in courses if 
                   search_lower in c.title.lower() or 
                   search_lower in c.description.lower() or
                   search_lower in c.category.lower()]
    
    return [
        CourseListResponse(
            id=c.id,
            title=c.title,
            short_description=c.short_description,
            price=c.price,
            thumbnail_url=c.thumbnail_url,
            category=c.category,
            level=c.level,
            instructor_name=c.instructor_name,
            enrolled_count=c.enrolled_count,
            lessons_count=len(c.lessons)
        )
        for c in courses
    ]

@app.get("/api/courses/featured", response_model=List[CourseListResponse])
async def get_featured_courses():
    courses = get_all_courses(published_only=True)
    featured = sorted(courses, key=lambda c: c.enrolled_count, reverse=True)[:4]
    
    return [
        CourseListResponse(
            id=c.id,
            title=c.title,
            short_description=c.short_description,
            price=c.price,
            thumbnail_url=c.thumbnail_url,
            category=c.category,
            level=c.level,
            instructor_name=c.instructor_name,
            enrolled_count=c.enrolled_count,
            lessons_count=len(c.lessons)
        )
        for c in featured
    ]

@app.get("/api/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

@app.post("/api/admin/courses", response_model=Course)
async def create_new_course(
    course_data: CourseCreate,
    admin: User = Depends(require_admin)
):
    course = create_course(course_data.model_dump())
    return course

@app.put("/api/admin/courses/{course_id}", response_model=Course)
async def update_existing_course(
    course_id: str,
    course_data: CourseUpdate,
    admin: User = Depends(require_admin)
):
    course = update_course(course_id, course_data.model_dump(exclude_unset=True))
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

@app.delete("/api/admin/courses/{course_id}")
async def delete_existing_course(
    course_id: str,
    admin: User = Depends(require_admin)
):
    success = delete_course(course_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return {"message": "Course deleted successfully"}

@app.get("/api/admin/courses", response_model=List[Course])
async def list_all_courses_admin(admin: User = Depends(require_admin)):
    return get_all_courses(published_only=False)

# Lesson management
@app.post("/api/admin/courses/{course_id}/lessons", response_model=Lesson)
async def add_lesson(
    course_id: str,
    lesson_data: LessonCreate,
    admin: User = Depends(require_admin)
):
    lesson = add_lesson_to_course(course_id, lesson_data.model_dump())
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return lesson

@app.put("/api/admin/lessons/{lesson_id}", response_model=Lesson)
async def update_existing_lesson(
    lesson_id: str,
    lesson_data: LessonCreate,
    admin: User = Depends(require_admin)
):
    lesson = update_lesson(lesson_id, lesson_data.model_dump())
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    return lesson

@app.delete("/api/admin/lessons/{lesson_id}")
async def delete_existing_lesson(
    lesson_id: str,
    admin: User = Depends(require_admin)
):
    success = delete_lesson(lesson_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    return {"message": "Lesson deleted successfully"}

# Enrollment endpoints
@app.get("/api/enrollments", response_model=List[EnrollmentResponse])
async def get_my_enrollments(current_user: User = Depends(get_current_user)):
    enrollments = get_user_enrollments(current_user.id)
    
    result = []
    for enrollment in enrollments:
        course = get_course_by_id(enrollment.course_id)
        if course:
            result.append(EnrollmentResponse(
                id=enrollment.id,
                course=CourseListResponse(
                    id=course.id,
                    title=course.title,
                    short_description=course.short_description,
                    price=course.price,
                    thumbnail_url=course.thumbnail_url,
                    category=course.category,
                    level=course.level,
                    instructor_name=course.instructor_name,
                    enrolled_count=course.enrolled_count,
                    lessons_count=len(course.lessons)
                ),
                enrolled_at=enrollment.enrolled_at,
                progress=enrollment.progress,
                completed_lessons=enrollment.completed_lessons
            ))
    
    return result

@app.get("/api/enrollments/{course_id}")
async def check_enrollment(
    course_id: str,
    current_user: User = Depends(get_current_user)
):
    enrollment = get_enrollment(current_user.id, course_id)
    if enrollment:
        return {"enrolled": True, "enrollment": enrollment}
    return {"enrolled": False}

@app.post("/api/enrollments/{course_id}/enroll")
async def enroll_free_course(
    course_id: str,
    current_user: User = Depends(get_current_user)
):
    course = get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if course.price > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This course requires payment"
        )
    
    existing = get_enrollment(current_user.id, course_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    enrollment = create_enrollment(current_user.id, course_id)
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}

@app.post("/api/enrollments/progress")
async def update_progress(
    progress: LessonProgress,
    current_user: User = Depends(get_current_user)
):
    enrollment = get_enrollment(current_user.id, progress.course_id)
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not enrolled in this course"
        )
    
    updated = update_enrollment_progress(enrollment.id, progress.lesson_id)
    return {"message": "Progress updated", "progress": updated.progress}

# Stripe payment endpoints
@app.post("/api/payments/create-checkout-session", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    data: CreateCheckoutSession,
    current_user: User = Depends(get_current_user)
):
    course = get_course_by_id(data.course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    existing = get_enrollment(current_user.id, data.course_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    if course.price == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This course is free, use the enroll endpoint"
        )
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": course.title,
                        "description": course.short_description,
                        "images": [course.thumbnail_url],
                    },
                    "unit_amount": int(course.price * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/courses/{course.id}",
            metadata={
                "user_id": current_user.id,
                "course_id": course.id,
            },
            customer_email=current_user.email,
        )
        
        create_payment(
            user_id=current_user.id,
            course_id=course.id,
            amount=course.price,
            stripe_payment_intent_id=checkout_session.id,
            status="pending"
        )
        
        return CheckoutSessionResponse(
            checkout_url=checkout_session.url,
            session_id=checkout_session.id
        )
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/api/payments/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            event = stripe.Event.construct_from(
                stripe.util.convert_to_dict(payload), stripe.api_key
            )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"]["user_id"]
        course_id = session["metadata"]["course_id"]
        
        payment = get_payment_by_stripe_id(session["id"])
        if payment:
            update_payment_status(payment.id, "completed")
        
        existing = get_enrollment(user_id, course_id)
        if not existing:
            create_enrollment(user_id, course_id)
    
    return {"status": "success"}

@app.get("/api/payments/verify/{session_id}")
async def verify_payment(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    payment = get_payment_by_stripe_id(session_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    if payment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == "paid":
            update_payment_status(payment.id, "completed")
            
            existing = get_enrollment(current_user.id, payment.course_id)
            if not existing:
                create_enrollment(current_user.id, payment.course_id)
            
            return {"status": "success", "enrolled": True}
    except stripe.error.StripeError:
        pass
    
    return {"status": payment.status, "enrolled": False}

# AI Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    if not OPENAI_API_KEY:
        return ChatResponse(
            response="AI assistant is not configured. Please contact support to enable this feature."
        )
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        course_context = ""
        if chat_request.course_id:
            course = get_course_by_id(chat_request.course_id)
            if course:
                course_context = f"\n\nContext: The student is learning about '{course.title}'. Course description: {course.description}"
        
        system_message = f"""You are a helpful AI teaching assistant for Virtual IT Labs, an online IT training platform. 
You help students understand technical concepts, answer questions about their courses, and provide guidance on IT topics.
Be friendly, encouraging, and provide clear explanations. If you don't know something, say so honestly.
{course_context}"""
        
        messages = [{"role": "system", "content": system_message}]
        
        for msg in chat_request.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": chat_request.message})
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return ChatResponse(response=response.choices[0].message.content)
    
    except Exception as e:
        return ChatResponse(
            response=f"I'm having trouble connecting right now. Please try again later. Error: {str(e)}"
        )

# Contact form
@app.post("/api/contact")
async def submit_contact_form(form: ContactForm):
    return {"message": "Thank you for your message. We'll get back to you soon!"}

# Categories and levels for filtering
@app.get("/api/categories")
async def get_categories():
    courses = get_all_courses(published_only=True)
    categories = list(set(c.category for c in courses))
    return {"categories": sorted(categories)}

@app.get("/api/levels")
async def get_levels():
    return {"levels": ["Beginner", "Intermediate", "Advanced"]}
