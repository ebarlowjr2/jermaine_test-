import Image from 'next/image';
import { Target, Users, Award, BookOpen } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Target, title: 'Mission-Driven', description: 'We are committed to making quality IT education accessible to everyone.' },
    { icon: Users, title: 'Community First', description: 'Building a supportive community of learners and professionals.' },
    { icon: Award, title: 'Excellence', description: 'Delivering high-quality, industry-relevant content and training.' },
    { icon: BookOpen, title: 'Continuous Learning', description: 'Staying current with the latest technologies and best practices.' },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & Lead Instructor',
      bio: 'Former Google engineer with 15+ years of experience in software development and cloud architecture.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Cloud & DevOps Lead',
      bio: 'AWS Solutions Architect with expertise in building scalable cloud infrastructure.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      name: 'Alex Rivera',
      role: 'Cybersecurity Expert',
      bio: 'Certified ethical hacker with experience in enterprise security consulting.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d5bbd] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Virtual IT Labs</h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering the next generation of IT professionals with hands-on training and real-world skills.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="mt-4 text-gray-600">
                Virtual IT Labs was founded in 2020 with a simple mission: to make quality IT education accessible to everyone, regardless of their background or location.
              </p>
              <p className="mt-4 text-gray-600">
                We noticed that traditional IT education often lacked the hands-on experience that employers demand. Our platform bridges this gap by providing virtual labs, real-world projects, and mentorship from industry experts.
              </p>
              <p className="mt-4 text-gray-600">
                Today, we have helped over 10,000 students launch or advance their IT careers, with graduates working at top companies like Google, Amazon, Microsoft, and countless startups.
              </p>
            </div>
            <div className="relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <value.icon className="w-12 h-12 mx-auto text-[#1877F2]" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-gray-600">Learn from industry experts with real-world experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="mx-auto rounded-full"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-[#1877F2] font-medium">{member.role}</p>
                <p className="mt-2 text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
