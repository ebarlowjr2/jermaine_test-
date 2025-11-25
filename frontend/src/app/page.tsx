'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/CourseCard';
import { coursesApi, CourseListItem } from '@/services/api';
import { AIChat } from '@/components/AIChat';
import { 
  ArrowRight, 
  GraduationCap, 
  PlayCircle, 
  Users, 
  Award,
  Monitor,
  Cloud,
  Shield,
  Code,
  Star
} from 'lucide-react';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<CourseListItem[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await coursesApi.list();
        setFeaturedCourses(courses.slice(0, 4));
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };
    loadCourses();
  }, []);

  const features = [
    { icon: Monitor, title: 'Hands-On Labs', description: 'Practice with real-world scenarios in our virtual lab environments.' },
    { icon: Cloud, title: 'Cloud Training', description: 'Master AWS, Azure, and GCP with comprehensive cloud courses.' },
    { icon: Shield, title: 'Cybersecurity', description: 'Learn to protect systems with our security-focused curriculum.' },
    { icon: Code, title: 'Programming', description: 'Build coding skills from Python to full-stack development.' },
  ];

  const stats = [
    { icon: GraduationCap, value: '10,000+', label: 'Students Enrolled' },
    { icon: PlayCircle, value: '500+', label: 'Video Lessons' },
    { icon: Users, value: '50+', label: 'Expert Instructors' },
    { icon: Award, value: '95%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      quote: 'Virtual IT Labs helped me transition from a helpdesk role to a cloud engineer position. The hands-on labs were invaluable!',
      name: 'Sarah Johnson',
      role: 'Cloud Engineer at AWS',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      quote: 'The cybersecurity courses are top-notch. I passed my Security+ certification on the first try thanks to this platform.',
      name: 'Michael Chen',
      role: 'Security Analyst',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      quote: 'The Docker and Kubernetes course was exactly what I needed. Now I confidently manage containerized applications at scale.',
      name: 'Emily Rodriguez',
      role: 'DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d5bbd] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Launch Your IT Career with
                <span className="text-yellow-300"> Hands-On Training</span>
              </h1>
              <p className="mt-6 text-lg text-blue-100">
                Master in-demand IT skills with expert-led courses, virtual labs, and personalized mentorship. Join thousands of successful IT professionals.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-[#1877F2] hover:bg-gray-100">
                    Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop"
                alt="IT Training"
                fill
                className="object-cover rounded-xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto text-[#1877F2]" />
                <div className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Virtual IT Labs?</h2>
            <p className="mt-4 text-lg text-gray-600">We provide comprehensive IT training with real-world applications</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-[#1877F2]" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
              <p className="mt-2 text-gray-600">Start your learning journey with our top courses</p>
            </div>
            <Link href="/courses">
              <Button variant="outline">
                View All Courses <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Students Say</h2>
            <p className="mt-2 text-gray-600">Join thousands of successful IT professionals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-4 flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1877F2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your IT Journey?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Join Virtual IT Labs today and get access to expert-led courses, hands-on labs, and a supportive community.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#1877F2] hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/mentorship">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Mentorship
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AIChat />
    </>
  );
}
