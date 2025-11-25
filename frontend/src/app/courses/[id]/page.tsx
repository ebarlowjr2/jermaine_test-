'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { coursesApi, enrollmentApi, paymentApi, Course, Enrollment } from '@/services/api';
import { AIChat } from '@/components/AIChat';
import { 
  PlayCircle, 
  Clock, 
  Users, 
  Award, 
  Download, 
  CheckCircle,
  Lock,
  BookOpen
} from 'lucide-react';

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const courseId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await coursesApi.get(courseId);
        setCourse(courseData);

        if (user) {
          try {
            const enrollments = await enrollmentApi.list();
            const userEnrollment = enrollments.find(e => e.course_id === courseId);
            if (userEnrollment) {
              setEnrollment(userEnrollment);
            }
          } catch {
            // User not enrolled
          }
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);

    try {
      if (course?.price === 0) {
        const newEnrollment = await enrollmentApi.enroll(courseId);
        setEnrollment(newEnrollment);
      } else {
        const { checkout_url } = await paymentApi.createCheckout(courseId);
        window.location.href = checkout_url;
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1877F2]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <Button className="mt-4" onClick={() => router.push('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d5bbd] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="mt-4 text-lg text-blue-100">{course.short_description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {course.enrolled_count} students
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {course.lessons?.length || 0} lessons
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  {course.level}
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <Image
                  src={course.instructor_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                  alt={course.instructor_name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="font-medium">Created by</p>
                  <p className="text-blue-100">{course.instructor_name}</p>
                </div>
              </div>
            </div>
            <div className="bg-white text-gray-900 rounded-xl p-6 shadow-xl">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-3xl font-bold text-[#1877F2]">
                {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
              </div>
              {enrollment ? (
                <div className="mt-4">
                  <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    You are enrolled
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Progress: {enrollment.progress}%
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#1877F2] rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <Button className="w-full">Continue Learning</Button>
                </div>
              ) : (
                <Button className="w-full mt-4" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Processing...' : course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h2>
                <div className="flex items-start">
                  <Image
                    src={course.instructor_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                    alt={course.instructor_name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{course.instructor_name}</h3>
                    <p className="text-gray-600 mt-2">{course.instructor_bio}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.lessons?.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center p-4 rounded-lg border ${
                        enrollment ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.description}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {lesson.duration_minutes} min
                      </div>
                      {enrollment ? (
                        enrollment.completed_lessons?.includes(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-4" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-[#1877F2] ml-4" />
                        )
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400 ml-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <PlayCircle className="w-5 h-5 text-[#1877F2] mr-3" />
                    {course.lessons?.length || 0} video lessons
                  </li>
                  <li className="flex items-center">
                    <Download className="w-5 h-5 text-[#1877F2] mr-3" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 text-[#1877F2] mr-3" />
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 text-[#1877F2] mr-3" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIChat courseId={courseId} courseName={course.title} />
    </>
  );
}
