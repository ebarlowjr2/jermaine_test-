import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Calendar, MessageCircle, Video, Target } from 'lucide-react';

export default function Mentorship() {
  const benefits = [
    { icon: Users, title: '1-on-1 Sessions', description: 'Personal guidance from industry experts tailored to your goals.' },
    { icon: Calendar, title: 'Flexible Scheduling', description: 'Book sessions that fit your schedule, available 7 days a week.' },
    { icon: MessageCircle, title: 'Ongoing Support', description: 'Get answers to your questions between sessions via chat.' },
    { icon: Video, title: 'Video Calls', description: 'High-quality video sessions with screen sharing capabilities.' },
    { icon: Target, title: 'Goal Setting', description: 'Create a personalized roadmap to achieve your career objectives.' },
    { icon: CheckCircle, title: 'Code Reviews', description: 'Get feedback on your projects and improve your skills.' },
  ];

  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Python & Machine Learning',
      experience: '15+ years',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      name: 'Michael Chen',
      specialty: 'AWS & Cloud Architecture',
      experience: '12+ years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      name: 'Alex Rivera',
      specialty: 'Cybersecurity & Ethical Hacking',
      experience: '10+ years',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
      name: 'Emily Watson',
      specialty: 'DevOps & Kubernetes',
      experience: '8+ years',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 99,
      period: 'month',
      features: ['2 mentoring sessions/month', 'Email support', 'Resource library access', 'Career guidance'],
    },
    {
      name: 'Professional',
      price: 199,
      period: 'month',
      features: ['4 mentoring sessions/month', 'Priority chat support', 'Code reviews', 'Project guidance', 'Resume review'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 399,
      period: 'month',
      features: ['8 mentoring sessions/month', '24/7 priority support', 'Unlimited code reviews', 'Custom learning path', 'Interview prep', 'Job referrals'],
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d5bbd] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Accelerate Your Career with Expert Mentorship</h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Get personalized guidance from industry professionals who have been where you want to go.
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-8 bg-white text-[#1877F2] hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Mentorship Program?</h2>
            <p className="mt-4 text-gray-600">Everything you need to succeed in your IT career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <benefit.icon className="w-10 h-10 text-[#1877F2]" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Mentors</h2>
            <p className="mt-4 text-gray-600">Learn from the best in the industry</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <Image
                  src={mentor.avatar}
                  alt={mentor.name}
                  width={100}
                  height={100}
                  className="mx-auto rounded-full"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-[#1877F2] font-medium">{mentor.specialty}</p>
                <p className="mt-1 text-sm text-gray-500">{mentor.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="mt-4 text-gray-600">Flexible options to fit your needs and budget</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-xl shadow-md ${
                  plan.popular ? 'ring-2 ring-[#1877F2] relative' : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1877F2] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#1877F2]">${plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full mt-8" variant={plan.popular ? 'default' : 'outline'}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
