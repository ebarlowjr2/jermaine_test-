import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CourseCard } from '../components/CourseCard';
import { coursesApi, CourseListItem } from '../services/api';
import { Search, Filter, X } from 'lucide-react';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          coursesApi.list({
            search: searchParams.get('search') || undefined,
            category: searchParams.get('category') || undefined,
            level: searchParams.get('level') || undefined,
          }),
          coursesApi.getCategories(),
        ]);
        setCourses(coursesData);
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (level) params.set('level', level);
    setSearchParams(params);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = search || category || level;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover expert-led courses designed to help you master in-demand IT skills
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-[#1877F2] hover:bg-[#1664d9]">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
