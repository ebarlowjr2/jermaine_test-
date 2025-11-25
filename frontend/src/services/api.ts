const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  
  return response.json();
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  created_at: string;
  avatar_url?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  thumbnail_url: string;
  category: string;
  level: string;
  instructor_name: string;
  instructor_bio: string;
  instructor_avatar?: string;
  is_published: boolean;
  created_at: string;
  lessons: Lesson[];
  enrolled_count: number;
}

export interface CourseListItem {
  id: string;
  title: string;
  short_description: string;
  price: number;
  thumbnail_url: string;
  category: string;
  level: string;
  instructor_name: string;
  enrolled_count: number;
  lessons_count: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  downloadable_materials: string[];
}

export interface Enrollment {
  id: string;
  course: CourseListItem;
  enrolled_at: string;
  progress: number;
  completed_lessons: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    apiRequest<LoginResponse>('/api/auth/register', { method: 'POST', body: data }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest<LoginResponse>('/api/auth/login', { method: 'POST', body: data }),
  
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: { email } }),
  
  resetPassword: (token: string, new_password: string) =>
    apiRequest<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: { token, new_password } }),
  
  getMe: () => apiRequest<User>('/api/auth/me'),
};

export const coursesApi = {
  list: (params?: { category?: string; level?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.level) searchParams.append('level', params.level);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return apiRequest<CourseListItem[]>(`/api/courses${query ? `?${query}` : ''}`);
  },
  
  featured: () => apiRequest<CourseListItem[]>('/api/courses/featured'),
  
  get: (id: string) => apiRequest<Course>(`/api/courses/${id}`),
  
  getCategories: () => apiRequest<{ categories: string[] }>('/api/categories'),
  
  getLevels: () => apiRequest<{ levels: string[] }>('/api/levels'),
};

export const adminApi = {
  listCourses: () => apiRequest<Course[]>('/api/admin/courses'),
  
  createCourse: (data: Partial<Course>) =>
    apiRequest<Course>('/api/admin/courses', { method: 'POST', body: data }),
  
  updateCourse: (id: string, data: Partial<Course>) =>
    apiRequest<Course>(`/api/admin/courses/${id}`, { method: 'PUT', body: data }),
  
  deleteCourse: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/courses/${id}`, { method: 'DELETE' }),
  
  addLesson: (courseId: string, data: Partial<Lesson>) =>
    apiRequest<Lesson>(`/api/admin/courses/${courseId}/lessons`, { method: 'POST', body: data }),
  
  updateLesson: (lessonId: string, data: Partial<Lesson>) =>
    apiRequest<Lesson>(`/api/admin/lessons/${lessonId}`, { method: 'PUT', body: data }),
  
  deleteLesson: (lessonId: string) =>
    apiRequest<{ message: string }>(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' }),
};

export const enrollmentApi = {
  list: () => apiRequest<Enrollment[]>('/api/enrollments'),
  
  check: (courseId: string) =>
    apiRequest<{ enrolled: boolean; enrollment?: Enrollment }>(`/api/enrollments/${courseId}`),
  
  enrollFree: (courseId: string) =>
    apiRequest<{ message: string; enrollment_id: string }>(`/api/enrollments/${courseId}/enroll`, { method: 'POST' }),
  
  updateProgress: (courseId: string, lessonId: string) =>
    apiRequest<{ message: string; progress: number }>('/api/enrollments/progress', {
      method: 'POST',
      body: { course_id: courseId, lesson_id: lessonId },
    }),
};

export const paymentApi = {
  createCheckoutSession: (courseId: string) =>
    apiRequest<{ checkout_url: string; session_id: string }>('/api/payments/create-checkout-session', {
      method: 'POST',
      body: { course_id: courseId },
    }),
  
  verifyPayment: (sessionId: string) =>
    apiRequest<{ status: string; enrolled: boolean }>(`/api/payments/verify/${sessionId}`),
};

export const chatApi = {
  send: (message: string, courseId?: string, history: ChatMessage[] = []) =>
    apiRequest<{ response: string }>('/api/chat', {
      method: 'POST',
      body: { message, course_id: courseId, history },
    }),
};

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    apiRequest<{ message: string }>('/api/contact', { method: 'POST', body: data }),
};
