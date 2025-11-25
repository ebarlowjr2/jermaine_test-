'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { adminApi, Course } from '@/services/api';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

export default function Admin() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isLoading, isAdmin, router]);

  useEffect(() => {
    const loadCourses = async () => {
      if (user && isAdmin) {
        try {
          const data = await adminApi.listCourses();
          setCourses(data);
        } catch (error) {
          console.error('Failed to load courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadCourses();
  }, [user, isAdmin]);

  const handleSave = async () => {
    if (!editingCourse) return;

    try {
      if (isCreating) {
        const newCourse = await adminApi.createCourse(editingCourse);
        setCourses([...courses, newCourse]);
      } else if (editingCourse.id) {
        const updatedCourse = await adminApi.updateCourse(editingCourse.id, editingCourse);
        setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      }
      setEditingCourse(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await adminApi.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const startCreate = () => {
    setEditingCourse({
      title: '',
      short_description: '',
      description: '',
      price: 0,
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'Programming',
      level: 'Beginner',
      instructor_name: user?.name || '',
      instructor_bio: '',
      instructor_avatar: '',
    });
    setIsCreating(true);
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1877F2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1877F2] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-blue-100">Manage courses and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Courses ({courses.length})</h2>
            <Button onClick={startCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          {editingCourse && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{isCreating ? 'Create Course' : 'Edit Course'}</h3>
                  <button onClick={() => { setEditingCourse(null); setIsCreating(false); }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={editingCourse.title || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <Input
                      value={editingCourse.short_description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, short_description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <Input
                        type="number"
                        value={editingCourse.price || 0}
                        onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={editingCourse.category || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        className="w-full h-9 rounded-md border border-input px-3"
                      >
                        <option value="Programming">Programming</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                    <Input
                      value={editingCourse.thumbnail_url || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail_url: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setEditingCourse(null); setIsCreating(false); }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2] mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Enrolled</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{course.title}</td>
                      <td className="py-3 px-4">{course.category}</td>
                      <td className="py-3 px-4">${course.price.toFixed(2)}</td>
                      <td className="py-3 px-4">{course.enrolled_count}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
