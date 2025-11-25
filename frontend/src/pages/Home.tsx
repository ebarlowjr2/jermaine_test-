import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CourseCard } from '../components/CourseCard';
import { coursesApi, CourseListItem } from '../services/api';
import {
  GraduationCap,
  Users,
  Award,
  PlayCircle,
  ArrowRight,
  Star,
  Monitor,
  Cloud,
  Shield,
  Code,
} from 'lucide-react';

export function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await coursesApi.featured();
        setFeaturedCourses(courses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const stats = [
    { icon: GraduationCap, value: '10,000+', label: 'Students Enrolled' },
    { icon: PlayCircle, value: '500+', label: 'Video Lessons' },
    { icon: Users, value: '50+', label: 'Expert Instructors' },
    { icon: Award, value: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: Monitor,
      title: 'Hands-On Labs',
      description: 'Practice with real-world scenarios in our virtual lab environments.',
    },
    {
      icon: Cloud,
      title: 'Cloud Training',
      description: 'Master AWS, Azure, and GCP with comprehensive cloud courses.',
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Learn to protect systems with our security-focused curriculum.',
    },
    {
      icon: Code,
      title: 'Programming',
      description: 'Build coding skills from Python to full-stack development.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Cloud Engineer at AWS',
      content:
        'Virtual IT Labs helped me transition from a helpdesk role to a cloud engineer position. The hands-on labs were invaluable!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      name: 'Michael Chen',
      role: 'Security Analyst',
      content:
        'The cybersecurity courses are top-notch. I passed my Security+ certification on the first try thanks to this platform.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      name: 'Emily Rodriguez',
      role: 'DevOps Engineer',
      content:
        'The Docker and Kubernetes course was exactly what I needed. Now I confidently manage containerized applications at scale.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-[#1877F2] via-[#1664d9] to-[#0d4ea6] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Launch Your IT Career with{' '}
                <span className="text-yellow-300">Hands-On Training</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Master in-demand IT skills with expert-led courses, virtual labs, and personalized
                mentorship. Join thousands of successful IT professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="bg-white text-[#1877F2] hover:bg-gray-100 font-semibold px-8"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 font-semibold px-8"
                  >
                    View Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600"
                alt="IT Training"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-10 h-10 text-[#1877F2] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Virtual IT Labs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive IT training with real-world applications
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-[#1877F2]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Courses
              </h2>
              <p className="text-gray-600">Start your learning journey with our top courses</p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="hidden md:flex">
                View All Courses
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link to="/courses">
              <Button variant="outline">
                View All Courses
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful IT professionals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white border-0 shadow-md">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1877F2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your IT Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Virtual IT Labs today and get access to expert-led courses, hands-on labs, and a
            supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-[#1877F2] hover:bg-gray-100 font-semibold px-8"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/mentorship">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                Explore Mentorship
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
