import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Users, BookOpen } from 'lucide-react';
import { CourseListItem } from '../services/api';

interface CourseCardProps {
  course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.price === 0 && (
            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
              Free
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <Badge variant="outline" className="mb-2 text-[#1877F2] border-[#1877F2]">
            {course.category}
          </Badge>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-[#1877F2] transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {course.short_description}
          </p>
          <p className="text-sm text-gray-500">by {course.instructor_name}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
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
          <span className="font-bold text-[#1877F2]">
            {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
