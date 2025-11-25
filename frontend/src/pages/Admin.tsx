import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { adminApi, Course } from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Users, DollarSign } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadCourses();
  }, [isAdmin, navigate]);

  const loadCourses = async () => {
    try {
      const data = await adminApi.listCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await adminApi.deleteCourse(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const totalStudents = courses.reduce((acc, c) => acc + c.enrolled_count, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + c.price * c.enrolled_count, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-[#1877F2] to-[#0d4ea6] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage courses, students, and content</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#1877F2]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Courses</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#1877F2] hover:bg-[#1664d9]"
                  onClick={() => setEditingCourse(null)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </DialogTitle>
                </DialogHeader>
                <CourseForm
                  course={editingCourse}
                  onSave={() => {
                    setIsDialogOpen(false);
                    loadCourses();
                  }}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <Badge
                              variant={course.is_published ? 'default' : 'secondary'}
                              className={course.is_published ? 'bg-green-500' : ''}
                            >
                              {course.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {course.short_description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{course.category}</span>
                            <span>{course.level}</span>
                            <span>{course.lessons.length} lessons</span>
                            <span>{course.enrolled_count} students</span>
                            <span className="font-medium text-[#1877F2]">
                              {course.price === 0 ? 'Free' : `$${course.price}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCourse(course);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface CourseFormProps {
  course: Course | null;
  onSave: () => void;
  onCancel: () => void;
}

function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    short_description: course?.short_description || '',
    price: course?.price || 0,
    thumbnail_url: course?.thumbnail_url || '',
    category: course?.category || 'Programming',
    level: course?.level || 'Beginner',
    instructor_name: course?.instructor_name || '',
    instructor_bio: course?.instructor_bio || '',
    instructor_avatar: course?.instructor_avatar || '',
    is_published: course?.is_published ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (course) {
        await adminApi.updateCourse(course.id, formData);
      } else {
        await adminApi.createCourse(formData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Course title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description
        </label>
        <Input
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          placeholder="Brief description for course cards"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed course description"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0 for free"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL
          </label>
          <Input
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
              <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="System Administration">System Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <Select
            value={formData.level}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructor Name
        </label>
        <Input
          name="instructor_name"
          value={formData.instructor_name}
          onChange={handleChange}
          placeholder="Instructor name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructor Bio
        </label>
        <Textarea
          name="instructor_bio"
          value={formData.instructor_bio}
          onChange={handleChange}
          placeholder="Brief instructor biography"
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructor Avatar URL
        </label>
        <Input
          name="instructor_avatar"
          value={formData.instructor_avatar}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_published}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_published: checked }))
          }
        />
        <label className="text-sm font-medium text-gray-700">Published</label>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#1877F2] hover:bg-[#1664d9]"
          disabled={loading}
        >
          {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
