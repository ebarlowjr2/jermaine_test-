from datetime import datetime
import uuid
import hashlib
from typing import Dict, List, Optional
from app.models import User, Course, Lesson, Enrollment, Payment, UserRole

users_db: Dict[str, User] = {}
courses_db: Dict[str, Course] = {}
lessons_db: Dict[str, Lesson] = {}
enrollments_db: Dict[str, Enrollment] = {}
payments_db: Dict[str, Payment] = {}

def generate_id() -> str:
    return str(uuid.uuid4())

def hash_password(password: str) -> str:
    # Simple SHA256 hash for proof of concept (use bcrypt/argon2 in production)
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def get_user_by_email(email: str) -> Optional[User]:
    for user in users_db.values():
        if user.email == email:
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[User]:
    return users_db.get(user_id)

def create_user(email: str, name: str, password: str, role: UserRole = UserRole.STUDENT) -> User:
    user_id = generate_id()
    user = User(
        id=user_id,
        email=email,
        name=name,
        hashed_password=hash_password(password),
        role=role,
        created_at=datetime.utcnow(),
        avatar_url=None
    )
    users_db[user_id] = user
    return user

def get_course_by_id(course_id: str) -> Optional[Course]:
    return courses_db.get(course_id)

def get_all_courses(published_only: bool = True) -> List[Course]:
    courses = list(courses_db.values())
    if published_only:
        courses = [c for c in courses if c.is_published]
    return courses

def create_course(course_data: dict) -> Course:
    course_id = generate_id()
    lessons_data = course_data.pop('lessons', [])
    
    course = Course(
        id=course_id,
        created_at=datetime.utcnow(),
        lessons=[],
        enrolled_count=0,
        **course_data
    )
    
    for i, lesson_data in enumerate(lessons_data):
        lesson_id = generate_id()
        # Remove order from lesson_data if present, we'll set it explicitly
        lesson_order = lesson_data.pop('order', i + 1)
        lesson = Lesson(
            id=lesson_id,
            course_id=course_id,
            order=lesson_order,
            **lesson_data
        )
        lessons_db[lesson_id] = lesson
        course.lessons.append(lesson)
    
    courses_db[course_id] = course
    return course

def update_course(course_id: str, update_data: dict) -> Optional[Course]:
    course = courses_db.get(course_id)
    if not course:
        return None
    
    for key, value in update_data.items():
        if value is not None and hasattr(course, key):
            setattr(course, key, value)
    
    courses_db[course_id] = course
    return course

def delete_course(course_id: str) -> bool:
    if course_id in courses_db:
        del courses_db[course_id]
        lessons_to_delete = [lid for lid, l in lessons_db.items() if l.course_id == course_id]
        for lid in lessons_to_delete:
            del lessons_db[lid]
        return True
    return False

def add_lesson_to_course(course_id: str, lesson_data: dict) -> Optional[Lesson]:
    course = courses_db.get(course_id)
    if not course:
        return None
    
    lesson_id = generate_id()
    lesson = Lesson(
        id=lesson_id,
        course_id=course_id,
        **lesson_data
    )
    lessons_db[lesson_id] = lesson
    course.lessons.append(lesson)
    courses_db[course_id] = course
    return lesson

def update_lesson(lesson_id: str, update_data: dict) -> Optional[Lesson]:
    lesson = lessons_db.get(lesson_id)
    if not lesson:
        return None
    
    for key, value in update_data.items():
        if value is not None and hasattr(lesson, key):
            setattr(lesson, key, value)
    
    lessons_db[lesson_id] = lesson
    
    course = courses_db.get(lesson.course_id)
    if course:
        course.lessons = [l if l.id != lesson_id else lesson for l in course.lessons]
        courses_db[lesson.course_id] = course
    
    return lesson

def delete_lesson(lesson_id: str) -> bool:
    lesson = lessons_db.get(lesson_id)
    if not lesson:
        return False
    
    course = courses_db.get(lesson.course_id)
    if course:
        course.lessons = [l for l in course.lessons if l.id != lesson_id]
        courses_db[lesson.course_id] = course
    
    del lessons_db[lesson_id]
    return True

def get_enrollment(user_id: str, course_id: str) -> Optional[Enrollment]:
    for enrollment in enrollments_db.values():
        if enrollment.user_id == user_id and enrollment.course_id == course_id:
            return enrollment
    return None

def get_user_enrollments(user_id: str) -> List[Enrollment]:
    return [e for e in enrollments_db.values() if e.user_id == user_id]

def create_enrollment(user_id: str, course_id: str) -> Enrollment:
    enrollment_id = generate_id()
    enrollment = Enrollment(
        id=enrollment_id,
        user_id=user_id,
        course_id=course_id,
        enrolled_at=datetime.utcnow(),
        progress=0.0,
        completed_lessons=[]
    )
    enrollments_db[enrollment_id] = enrollment
    
    course = courses_db.get(course_id)
    if course:
        course.enrolled_count += 1
        courses_db[course_id] = course
    
    return enrollment

def update_enrollment_progress(enrollment_id: str, lesson_id: str) -> Optional[Enrollment]:
    enrollment = enrollments_db.get(enrollment_id)
    if not enrollment:
        return None
    
    if lesson_id not in enrollment.completed_lessons:
        enrollment.completed_lessons.append(lesson_id)
    
    course = courses_db.get(enrollment.course_id)
    if course and len(course.lessons) > 0:
        enrollment.progress = (len(enrollment.completed_lessons) / len(course.lessons)) * 100
    
    enrollments_db[enrollment_id] = enrollment
    return enrollment

def create_payment(user_id: str, course_id: str, amount: float, stripe_payment_intent_id: str, status: str) -> Payment:
    payment_id = generate_id()
    payment = Payment(
        id=payment_id,
        user_id=user_id,
        course_id=course_id,
        amount=amount,
        stripe_payment_intent_id=stripe_payment_intent_id,
        status=status,
        created_at=datetime.utcnow()
    )
    payments_db[payment_id] = payment
    return payment

def get_payment_by_stripe_id(stripe_id: str) -> Optional[Payment]:
    for payment in payments_db.values():
        if payment.stripe_payment_intent_id == stripe_id:
            return payment
    return None

def update_payment_status(payment_id: str, status: str) -> Optional[Payment]:
    payment = payments_db.get(payment_id)
    if payment:
        payment.status = status
        payments_db[payment_id] = payment
    return payment

def seed_database():
    admin = create_user(
        email="admin@virtualitlabs.com",
        name="Admin User",
        password="admin123",
        role=UserRole.ADMIN
    )
    
    demo_user = create_user(
        email="demo@example.com",
        name="Demo Student",
        password="demo123",
        role=UserRole.STUDENT
    )
    
    courses_data = [
        {
            "title": "Complete Python Bootcamp: From Zero to Hero",
            "description": """Master Python programming from scratch! This comprehensive course covers everything from basic syntax to advanced concepts like object-oriented programming, web scraping, and automation.

You'll learn:
- Python fundamentals and data structures
- Functions, modules, and packages
- Object-oriented programming
- File handling and error management
- Web scraping with BeautifulSoup
- Automation scripts
- Working with APIs
- Database integration

By the end of this course, you'll be able to build real-world Python applications and have a solid foundation for data science or web development.""",
            "short_description": "Learn Python from scratch with hands-on projects and real-world applications.",
            "price": 49.99,
            "thumbnail_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
            "category": "Programming",
            "level": "Beginner",
            "instructor_name": "Dr. Sarah Johnson",
            "instructor_bio": "Senior Software Engineer with 15+ years of experience. Former Google engineer and Python advocate.",
            "instructor_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
            "lessons": [
                {"title": "Introduction to Python", "description": "Get started with Python programming", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 15, "order": 1, "downloadable_materials": ["python_basics.pdf", "setup_guide.pdf"]},
                {"title": "Variables and Data Types", "description": "Learn about Python variables and data types", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 25, "order": 2, "downloadable_materials": ["variables_cheatsheet.pdf"]},
                {"title": "Control Flow", "description": "Master if statements, loops, and conditionals", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 30, "order": 3, "downloadable_materials": []},
                {"title": "Functions and Modules", "description": "Create reusable code with functions", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 4, "downloadable_materials": ["functions_examples.py"]},
                {"title": "Object-Oriented Programming", "description": "Learn OOP concepts in Python", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 45, "order": 5, "downloadable_materials": ["oop_guide.pdf"]},
            ]
        },
        {
            "title": "AWS Cloud Practitioner Certification Prep",
            "description": """Prepare for the AWS Cloud Practitioner certification exam with this comprehensive course. Learn cloud computing fundamentals and AWS services.

Topics covered:
- Cloud computing concepts
- AWS Global Infrastructure
- Core AWS services (EC2, S3, RDS, Lambda)
- Security and compliance
- Billing and pricing
- Support plans
- Practice exams and quizzes

This course includes hands-on labs and practice questions to ensure you're fully prepared for the certification exam.""",
            "short_description": "Pass the AWS Cloud Practitioner exam with confidence. Includes practice tests!",
            "price": 79.99,
            "thumbnail_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            "category": "Cloud Computing",
            "level": "Beginner",
            "instructor_name": "Michael Chen",
            "instructor_bio": "AWS Solutions Architect with 10+ years of cloud experience. Certified AWS instructor.",
            "instructor_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            "lessons": [
                {"title": "Introduction to Cloud Computing", "description": "Understanding cloud fundamentals", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 20, "order": 1, "downloadable_materials": ["cloud_intro.pdf"]},
                {"title": "AWS Global Infrastructure", "description": "Learn about regions, AZs, and edge locations", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 25, "order": 2, "downloadable_materials": []},
                {"title": "EC2 and Compute Services", "description": "Master AWS compute services", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 40, "order": 3, "downloadable_materials": ["ec2_guide.pdf"]},
                {"title": "S3 and Storage Services", "description": "Learn AWS storage options", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 4, "downloadable_materials": []},
                {"title": "Security and IAM", "description": "AWS security best practices", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 30, "order": 5, "downloadable_materials": ["security_checklist.pdf"]},
                {"title": "Practice Exam", "description": "Full practice exam with explanations", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 60, "order": 6, "downloadable_materials": ["practice_exam.pdf"]},
            ]
        },
        {
            "title": "Cybersecurity Fundamentals",
            "description": """Learn the essential skills to protect systems and networks from cyber threats. This course covers security principles, threat analysis, and defensive techniques.

What you'll learn:
- Security fundamentals and CIA triad
- Network security basics
- Cryptography essentials
- Malware analysis
- Penetration testing basics
- Incident response
- Security tools and frameworks
- Compliance and governance

Perfect for beginners looking to start a career in cybersecurity or IT professionals wanting to enhance their security knowledge.""",
            "short_description": "Master cybersecurity basics and protect against modern threats.",
            "price": 89.99,
            "thumbnail_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
            "category": "Cybersecurity",
            "level": "Intermediate",
            "instructor_name": "Alex Rivera",
            "instructor_bio": "Certified Ethical Hacker and Security Consultant. Former NSA analyst with expertise in threat intelligence.",
            "instructor_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
            "lessons": [
                {"title": "Security Fundamentals", "description": "Introduction to cybersecurity concepts", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 25, "order": 1, "downloadable_materials": ["security_basics.pdf"]},
                {"title": "Network Security", "description": "Protecting network infrastructure", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 2, "downloadable_materials": []},
                {"title": "Cryptography Basics", "description": "Understanding encryption and hashing", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 40, "order": 3, "downloadable_materials": ["crypto_guide.pdf"]},
                {"title": "Threat Analysis", "description": "Identifying and analyzing threats", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 30, "order": 4, "downloadable_materials": []},
                {"title": "Incident Response", "description": "Handling security incidents", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 45, "order": 5, "downloadable_materials": ["ir_playbook.pdf"]},
            ]
        },
        {
            "title": "Docker & Kubernetes Masterclass",
            "description": """Master containerization and orchestration with Docker and Kubernetes. Learn to deploy, scale, and manage containerized applications.

Course content:
- Docker fundamentals
- Building and managing containers
- Docker Compose
- Kubernetes architecture
- Deployments and services
- ConfigMaps and Secrets
- Helm charts
- CI/CD with containers
- Production best practices

Includes hands-on labs with real-world scenarios and projects.""",
            "short_description": "Learn containerization and orchestration from basics to production.",
            "price": 99.99,
            "thumbnail_url": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
            "category": "DevOps",
            "level": "Intermediate",
            "instructor_name": "Emily Watson",
            "instructor_bio": "DevOps Engineer at Netflix. Kubernetes certified administrator and Docker Captain.",
            "instructor_avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
            "lessons": [
                {"title": "Docker Basics", "description": "Getting started with Docker", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 30, "order": 1, "downloadable_materials": ["docker_cheatsheet.pdf"]},
                {"title": "Building Docker Images", "description": "Creating custom Docker images", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 2, "downloadable_materials": []},
                {"title": "Docker Compose", "description": "Multi-container applications", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 40, "order": 3, "downloadable_materials": ["compose_examples.zip"]},
                {"title": "Kubernetes Introduction", "description": "Understanding K8s architecture", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 45, "order": 4, "downloadable_materials": ["k8s_guide.pdf"]},
                {"title": "Deployments and Services", "description": "Managing K8s workloads", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 50, "order": 5, "downloadable_materials": []},
                {"title": "Helm and Package Management", "description": "Using Helm for K8s", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 6, "downloadable_materials": ["helm_templates.zip"]},
            ]
        },
        {
            "title": "Linux System Administration",
            "description": """Become a proficient Linux system administrator. This course covers everything from basic commands to advanced system management.

Topics include:
- Linux fundamentals and file system
- User and permission management
- Package management
- Process management
- Shell scripting
- Networking configuration
- System monitoring
- Backup and recovery
- Security hardening

Hands-on exercises with real Linux environments included.""",
            "short_description": "Master Linux administration skills for enterprise environments.",
            "price": 69.99,
            "thumbnail_url": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
            "category": "System Administration",
            "level": "Beginner",
            "instructor_name": "David Park",
            "instructor_bio": "Senior Linux Administrator with 20+ years of experience. Red Hat certified instructor.",
            "instructor_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
            "lessons": [
                {"title": "Linux Basics", "description": "Introduction to Linux", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 25, "order": 1, "downloadable_materials": ["linux_commands.pdf"]},
                {"title": "File System Navigation", "description": "Working with files and directories", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 30, "order": 2, "downloadable_materials": []},
                {"title": "User Management", "description": "Managing users and groups", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 3, "downloadable_materials": ["user_mgmt_guide.pdf"]},
                {"title": "Shell Scripting", "description": "Automating tasks with bash", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 45, "order": 4, "downloadable_materials": ["script_examples.sh"]},
                {"title": "System Monitoring", "description": "Monitoring and troubleshooting", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 40, "order": 5, "downloadable_materials": []},
            ]
        },
        {
            "title": "Introduction to Machine Learning",
            "description": """Start your journey into machine learning and artificial intelligence. Learn the fundamentals and build your first ML models.

What's covered:
- ML fundamentals and types
- Data preprocessing
- Supervised learning algorithms
- Unsupervised learning
- Model evaluation
- Feature engineering
- Neural networks basics
- Practical projects with Python

No prior ML experience required, but basic Python knowledge is helpful.""",
            "short_description": "Begin your AI journey with practical machine learning fundamentals.",
            "price": 0,
            "thumbnail_url": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
            "category": "Data Science",
            "level": "Beginner",
            "instructor_name": "Dr. Lisa Zhang",
            "instructor_bio": "AI Research Scientist at DeepMind. PhD in Machine Learning from Stanford.",
            "instructor_avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
            "lessons": [
                {"title": "What is Machine Learning?", "description": "Introduction to ML concepts", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 20, "order": 1, "downloadable_materials": ["ml_intro.pdf"]},
                {"title": "Data Preprocessing", "description": "Preparing data for ML", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 35, "order": 2, "downloadable_materials": ["preprocessing_notebook.ipynb"]},
                {"title": "Supervised Learning", "description": "Classification and regression", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 45, "order": 3, "downloadable_materials": []},
                {"title": "Unsupervised Learning", "description": "Clustering and dimensionality reduction", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 40, "order": 4, "downloadable_materials": []},
                {"title": "Building Your First Model", "description": "Hands-on ML project", "video_url": "https://www.youtube.com/embed/kqtD5dpn9C8", "duration_minutes": 60, "order": 5, "downloadable_materials": ["project_starter.zip"]},
            ]
        },
    ]
    
    for course_data in courses_data:
        create_course(course_data)
    
    print(f"Database seeded with {len(users_db)} users and {len(courses_db)} courses")

seed_database()
