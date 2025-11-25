import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { enrollmentApi, Enrollment } from '../services/api';
import { BookOpen, Clock, Award, ArrowRight, PlayCircle } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const data = await enrollmentApi.list();
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to load enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEnrollments();
  }, []);

  const inProgressCourses = enrollments.filter((e) => e.progress < 100);
  const completedCourses = enrollments.filter((e) => e.progress >= 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100">Continue your learning journey</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#1877F2]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900">{inProgressCourses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="in-progress" className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
              <TabsTrigger value="all">All Courses ({enrollments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-gray-200" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : inProgressCourses.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No courses in progress
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start learning by enrolling in a course
                    </p>
                    <Link to="/courses">
                      <Button className="bg-[#1877F2] hover:bg-[#1664d9]">
                        Browse Courses
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((enrollment) => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedCourses.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No completed courses yet
                    </h3>
                    <p className="text-gray-600">
                      Keep learning to earn your first certificate!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((enrollment) => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {enrollments.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No enrolled courses
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start your learning journey today
                    </p>
                    <Link to="/courses">
                      <Button className="bg-[#1877F2] hover:bg-[#1664d9]">
                        Browse Courses
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const isCompleted = enrollment.progress >= 100;

  return (
    <Link to={`/courses/${enrollment.course.id}`}>
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={enrollment.course.thumbnail_url}
            alt={enrollment.course.title}
            className="w-full aspect-video object-cover"
          />
          {isCompleted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Completed
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {enrollment.course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">by {enrollment.course.instructor_name}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(enrollment.progress)}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
          <Button
            className={`w-full mt-4 ${
              isCompleted
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-[#1877F2] hover:bg-[#1664d9]'
            }`}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
