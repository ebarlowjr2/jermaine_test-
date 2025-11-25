import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Users,
  Calendar,
  MessageCircle,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
} from 'lucide-react';

export function Mentorship() {
  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cloud Architecture & DevOps',
      experience: '15+ years',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      rating: 4.9,
      sessions: 500,
    },
    {
      name: 'Michael Chen',
      specialty: 'AWS & Cloud Solutions',
      experience: '10+ years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      rating: 4.8,
      sessions: 350,
    },
    {
      name: 'Emily Rodriguez',
      specialty: 'Cybersecurity & Ethical Hacking',
      experience: '12+ years',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      rating: 4.9,
      sessions: 420,
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 99,
      period: 'month',
      features: [
        '2 one-on-one sessions per month',
        'Email support',
        'Career guidance',
        'Resume review',
        'Access to community',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: 199,
      period: 'month',
      features: [
        '4 one-on-one sessions per month',
        'Priority email & chat support',
        'Career roadmap planning',
        'Resume & LinkedIn optimization',
        'Mock interviews',
        'Project code reviews',
        'Access to exclusive resources',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 399,
      period: 'month',
      features: [
        'Unlimited one-on-one sessions',
        '24/7 priority support',
        'Personalized learning path',
        'Job placement assistance',
        'Technical interview prep',
        'Real project collaboration',
        'Certificate of mentorship',
        'Networking opportunities',
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Personalized Guidance',
      description: 'Get tailored advice based on your goals, experience, and learning style.',
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work for you, with mentors across time zones.',
    },
    {
      icon: MessageCircle,
      title: 'Ongoing Support',
      description: 'Stay connected with your mentor between sessions for quick questions.',
    },
    {
      icon: Users,
      title: 'Industry Connections',
      description: 'Expand your network through introductions and community events.',
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white mb-4">1-on-1 Mentorship</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Accelerate Your Career with Expert Mentorship
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Get personalized guidance from industry experts who have been where you want to go.
              Our mentors help you navigate your IT career with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-[#1877F2] hover:bg-gray-100 font-semibold"
              >
                Find a Mentor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Mentorship?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learning from someone who's been there makes all the difference
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-[#1877F2]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Mentors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry leaders with proven track records
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-[#1877F2] font-medium mb-2">{mentor.specialty}</p>
                  <p className="text-gray-600 text-sm mb-4">{mentor.experience} experience</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                      {mentor.rating}
                    </span>
                    <span className="text-gray-500">{mentor.sessions}+ sessions</span>
                  </div>
                  <Button className="w-full mt-4 bg-[#1877F2] hover:bg-[#1664d9]">
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mentorship Plans</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your learning goals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${
                  plan.popular ? 'border-2 border-[#1877F2] shadow-lg' : 'border shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#1877F2] text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#1877F2]">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[#1877F2] hover:bg-[#1664d9]'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1877F2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of IT professionals who have accelerated their careers with our
            mentorship program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#1877F2] hover:bg-gray-100 font-semibold px-8"
            >
              Start Your Journey
            </Button>
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
