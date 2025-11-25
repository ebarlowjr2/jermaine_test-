const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatar_url?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
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
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order: number;
  downloadable_materials: string[];
}

export interface Course extends CourseListItem {
  description: string;
  instructor_bio: string;
  instructor_avatar: string;
  lessons: Lesson[];
  is_published: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed_lessons: string[];
  course: CourseListItem;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: { email: string; name: string; password: string }) =>
    apiRequest<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => apiRequest<User>('/api/auth/me'),

  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
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

  get: (id: string) => apiRequest<Course>(`/api/courses/${id}`),

  getFeatured: () => apiRequest<CourseListItem[]>('/api/courses?featured=true'),
};

export const enrollmentApi = {
  list: () => apiRequest<Enrollment[]>('/api/enrollments'),

  enroll: (courseId: string) =>
    apiRequest<Enrollment>(`/api/enrollments/${courseId}`, {
      method: 'POST',
    }),

  updateProgress: (courseId: string, lessonId: string) =>
    apiRequest<Enrollment>(`/api/enrollments/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    }),
};

export const paymentApi = {
  createCheckout: (courseId: string) =>
    apiRequest<{ checkout_url: string }>('/api/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    }),

  verifyPayment: (sessionId: string) =>
    apiRequest<{ enrolled: boolean }>('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
};

export const adminApi = {
  listCourses: () => apiRequest<Course[]>('/api/admin/courses'),

  createCourse: (data: Partial<Course>) =>
    apiRequest<Course>('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCourse: (id: string, data: Partial<Course>) =>
    apiRequest<Course>(`/api/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/admin/courses/${id}`, {
      method: 'DELETE',
    }),
};

export const chatApi = {
  sendMessage: (message: string, courseId?: string) =>
    apiRequest<{ response: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, course_id: courseId }),
    }),
};

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    apiRequest<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
