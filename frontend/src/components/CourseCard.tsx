import Link from 'next/link';
import Image from 'next/image';
import { Users, BookOpen } from 'lucide-react';
import { CourseListItem } from '@/services/api';

interface CourseCardProps {
  course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {course.price === 0 && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <span className="text-xs font-semibold text-[#1877F2] bg-blue-50 px-2 py-1 rounded-full w-fit">
            {course.category}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
            {course.short_description}
          </p>
          <p className="mt-2 text-xs text-gray-500">by {course.instructor_name}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.enrolled_count}
              </span>
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {course.lessons_count} lessons
              </span>
            </div>
            <span className="text-lg font-bold text-[#1877F2]">
              {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
