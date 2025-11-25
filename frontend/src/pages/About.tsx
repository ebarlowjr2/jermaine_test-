import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Award, BookOpen } from 'lucide-react';

export function About() {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & Lead Instructor',
      bio: 'Former Google engineer with 15+ years of experience in software development and cloud architecture.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    },
    {
      name: 'Michael Chen',
      role: 'Cloud Solutions Architect',
      bio: 'AWS Solutions Architect with expertise in designing scalable cloud infrastructure.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Cybersecurity Expert',
      bio: 'Certified Ethical Hacker with experience in penetration testing and security consulting.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    },
    {
      name: 'David Park',
      role: 'DevOps Engineer',
      bio: 'Kubernetes certified administrator with expertise in CI/CD and infrastructure automation.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Practical Learning',
      description: 'We believe in hands-on experience. Every course includes real-world projects and lab exercises.',
    },
    {
      icon: Eye,
      title: 'Industry Relevance',
      description: 'Our curriculum is constantly updated to reflect the latest industry trends and technologies.',
    },
    {
      icon: Heart,
      title: 'Student Success',
      description: 'Your success is our priority. We provide personalized support and mentorship.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a thriving community of IT professionals who support and learn from each other.',
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Virtual IT Labs</h1>
            <p className="text-xl text-blue-100">
              We're on a mission to make quality IT education accessible to everyone. Our platform
              combines expert instruction with hands-on practice to help you build real-world skills.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Virtual IT Labs was founded in 2020 with a simple goal: to bridge the gap between
                  traditional IT education and the skills employers actually need.
                </p>
                <p>
                  Our founders, experienced IT professionals themselves, recognized that many aspiring
                  tech workers struggled to gain practical experience. Theory alone wasn't enough to
                  land jobs or excel in the field.
                </p>
                <p>
                  That's why we built a platform that emphasizes hands-on learning. Every course
                  includes virtual labs where students can practice in real environments, work on
                  actual projects, and build portfolios that impress employers.
                </p>
                <p>
                  Today, we've helped thousands of students launch and advance their IT careers,
                  from complete beginners to seasoned professionals looking to upskill.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're guided by principles that put students first
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-[#1877F2]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Instructors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry experts with real-world experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-[#1877F2] font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#1877F2] mb-2">10,000+</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Students Trained
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#1877F2] mb-2">50+</div>
              <div className="text-gray-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Expert Courses
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#1877F2] mb-2">95%</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Award className="w-5 h-5 mr-2" />
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1877F2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your learning journey today and become part of our growing community of IT
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-white text-[#1877F2] hover:bg-gray-100 font-semibold px-8"
              >
                Browse Courses
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
