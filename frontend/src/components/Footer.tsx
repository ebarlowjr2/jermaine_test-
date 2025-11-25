import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-white">Virtual IT Labs</span>
            </Link>
            <p className="text-sm text-gray-400">
              Empowering IT professionals with hands-on training and real-world skills.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-sm hover:text-[#1877F2] transition-colors">Courses</Link></li>
              <li><Link href="/mentorship" className="text-sm hover:text-[#1877F2] transition-colors">Mentorship</Link></li>
              <li><Link href="/about" className="text-sm hover:text-[#1877F2] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-[#1877F2] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/courses?category=Programming" className="text-sm hover:text-[#1877F2] transition-colors">Programming</Link></li>
              <li><Link href="/courses?category=Cloud Computing" className="text-sm hover:text-[#1877F2] transition-colors">Cloud Computing</Link></li>
              <li><Link href="/courses?category=Cybersecurity" className="text-sm hover:text-[#1877F2] transition-colors">Cybersecurity</Link></li>
              <li><Link href="/courses?category=DevOps" className="text-sm hover:text-[#1877F2] transition-colors">DevOps</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2" />
              support@virtualitlabs.com
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Virtual IT Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
