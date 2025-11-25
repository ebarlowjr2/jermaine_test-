'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { enrollmentApi, Enrollment } from '@/services/api';
import { BookOpen, Clock, Award, Settings } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (user) {
        try {
          const data = await enrollmentApi.list();
          setEnrollments(data);
        } catch (error) {
          console.error('Failed to load enrollments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadEnrollments();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1877F2]"></div>
      </div>
    );
  }

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: enrollments.length },
    { icon: Clock, label: 'Hours Learned', value: Math.floor(enrollments.reduce((acc, e) => acc + (e.progress * 10), 0)) },
    { icon: Award, label: 'Completed', value: enrollments.filter(e => e.progress === 100).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1877F2] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-blue-100">Continue your learning journey</p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <stat.icon className="w-8 h-8 text-[#1877F2]" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
            <Link href="/courses">
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2] mx-auto"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses yet</h3>
              <p className="mt-2 text-gray-600">Start your learning journey by enrolling in a course.</p>
              <Link href="/courses">
                <Button className="mt-4">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <Link key={enrollment.id} href={`/courses/${enrollment.course_id}`}>
                  <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative w-24 h-16 flex-shrink-0">
                      <Image
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-500">{enrollment.course.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#1877F2]">{enrollment.progress}% complete</div>
                      <div className="mt-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1877F2] rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
