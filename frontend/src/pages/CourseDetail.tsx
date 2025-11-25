import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { AIChat } from '../components/AIChat';
import { useAuth } from '../context/AuthContext';
import { coursesApi, enrollmentApi, paymentApi, Course, Enrollment } from '../services/api';
import {
  PlayCircle,
  Clock,
  Users,
  Award,
  Download,
  CheckCircle,
  Lock,
  BookOpen,
  Star,
} from 'lucide-react';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const courseData = await coursesApi.get(id);
        setCourse(courseData);

        if (user) {
          try {
            const enrollmentData = await enrollmentApi.check(id);
            if (enrollmentData.enrolled && enrollmentData.enrollment) {
              setEnrollment(enrollmentData.enrollment as unknown as Enrollment);
            }
          } catch {
            // Not enrolled
          }
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (!course) return;

    setEnrolling(true);
    try {
      if (course.price === 0) {
        await enrollmentApi.enrollFree(course.id);
        const enrollmentData = await enrollmentApi.check(course.id);
        if (enrollmentData.enrolled && enrollmentData.enrollment) {
          setEnrollment(enrollmentData.enrollment as unknown as Enrollment);
        }
      } else {
        const { checkout_url } = await paymentApi.createCheckoutSession(course.id);
        window.location.href = checkout_url;
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!course || !enrollment) return;
    try {
      await enrollmentApi.updateProgress(course.id, lessonId);
      const enrollmentData = await enrollmentApi.check(course.id);
      if (enrollmentData.enrolled && enrollmentData.enrollment) {
        setEnrollment(enrollmentData.enrollment as unknown as Enrollment);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1877F2]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration_minutes, 0);
  const isEnrolled = !!enrollment;
  const completedLessons = enrollment?.completed_lessons || [];
  const progress = enrollment?.progress || 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="bg-white/20 text-white mb-4">{course.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.short_description}</p>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <span className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  4.8 (1,234 reviews)
                </span>
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-1" />
                  {course.enrolled_count} students
                </span>
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-1" />
                  {course.lessons.length} lessons
                </span>
              </div>
              <div className="flex items-center mt-6">
                <img
                  src={course.instructor_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                  alt={course.instructor_name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-blue-100">{course.instructor_name}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <CardContent className="p-6">
                  {isEnrolled ? (
                    <div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Your progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <Button
                        className="w-full bg-[#1877F2] hover:bg-[#1664d9]"
                        onClick={() => setActiveLesson(course.lessons[0]?.id)}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                      </div>
                      <Button
                        className="w-full bg-[#1877F2] hover:bg-[#1664d9] mb-3"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Processing...' : course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                      </Button>
                      <p className="text-center text-sm text-gray-500">
                        30-day money-back guarantee
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="curriculum" className="space-y-8">
            <TabsList className="bg-white border">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                  <div className="space-y-4">
                    {course.lessons.map((lesson, index) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isActive = activeLesson === lesson.id;
                      const canAccess = isEnrolled;

                      return (
                        <div
                          key={lesson.id}
                          className={`border rounded-lg p-4 transition-all ${
                            isActive ? 'border-[#1877F2] bg-blue-50' : 'hover:border-gray-300'
                          } ${canAccess ? 'cursor-pointer' : ''}`}
                          onClick={() => canAccess && setActiveLesson(lesson.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isCompleted
                                    ? 'bg-green-100 text-green-600'
                                    : canAccess
                                    ? 'bg-[#1877F2] text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : canAccess ? (
                                  <PlayCircle className="w-5 h-5" />
                                ) : (
                                  <Lock className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {index + 1}. {lesson.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                {lesson.downloadable_materials.length > 0 && (
                                  <div className="flex items-center mt-2 text-sm text-[#1877F2]">
                                    <Download className="w-4 h-4 mr-1" />
                                    {lesson.downloadable_materials.length} downloadable resource
                                    {lesson.downloadable_materials.length !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {lesson.duration_minutes} min
                            </span>
                          </div>

                          {isActive && canAccess && (
                            <div className="mt-4 pt-4 border-t">
                              {lesson.video_url && (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                  <iframe
                                    src={lesson.video_url}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={lesson.title}
                                  />
                                </div>
                              )}
                              {!isCompleted && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLessonComplete(lesson.id);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Complete
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Course</h2>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {course.description}
                  </div>
                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <Award className="w-6 h-6 text-[#1877F2] flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Certificate of Completion</h3>
                        <p className="text-sm text-gray-600">
                          Earn a certificate when you complete the course
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-6 h-6 text-[#1877F2] flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
                        <p className="text-sm text-gray-600">
                          Access the course content anytime, anywhere
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={course.instructor_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                      alt={course.instructor_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{course.instructor_name}</h2>
                      <p className="text-[#1877F2] font-medium mb-4">Course Instructor</p>
                      <p className="text-gray-600">{course.instructor_bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {isEnrolled && <AIChat courseId={course.id} />}
    </div>
  );
}
