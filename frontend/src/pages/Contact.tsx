import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { contactApi } from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactApi.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    }finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100">
              Have questions about our courses or need help? We're here to assist you on your
              learning journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                  {success ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button onClick={() => setSuccess(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>
                      {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-[#1877F2] hover:bg-[#1664d9]"
                        disabled={loading}
                      >
                        {loading ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#1877F2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">support@virtualitlabs.com</p>
                      <p className="text-gray-600">info@virtualitlabs.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#1877F2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#1877F2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                      <p className="text-gray-600">
                        123 Tech Street, Suite 100
                        <br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977904555!2d-122.39568388468204!3d37.78779997975772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807abad77c31%3A0x3f10d5e0c3e8f0e0!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Office Location"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: 'How do I access my courses?',
                a: 'After enrolling, you can access your courses from your dashboard. Simply log in and click on "My Courses" to start learning.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied, contact us for a full refund.',
              },
              {
                q: 'Can I get a certificate?',
                a: 'Yes! Upon completing a course, you\'ll receive a certificate of completion that you can share on LinkedIn or with employers.',
              },
              {
                q: 'How do I contact my instructor?',
                a: 'You can reach instructors through the course discussion forum or by using the AI assistant for quick questions.',
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
