'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/content/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, BookOpen, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { Course, Module, NewModuleRequest } from "@/types/backend-api";

const AddModulesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  // State management
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Module creation state
  const [showModuleCreator, setShowModuleCreator] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [moduleCreationError, setModuleCreationError] = useState<string | null>(null);

  // Load course and modules data
  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load course details and modules in parallel
        const [courseData, modulesData] = await Promise.all([
          apiService.getCourseById(parseInt(courseId)),
          apiService.getModulesByCourseId(parseInt(courseId))
        ]);

        setCourse(courseData);
        setModules(modulesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (!courseId || !newModuleTitle.trim()) {
      setModuleCreationError('Module title is required');
      return;
    }

    try {
      setIsCreatingModule(true);
      setModuleCreationError(null);

      const moduleData: NewModuleRequest = {
        title: newModuleTitle.trim(),
        body: newModuleDescription.trim(),
        courseId: parseInt(courseId)
      };

      const newModule = await apiService.createModule(moduleData);

      // Add the new module to the list
      setModules(prev => [...prev, newModule]);

      // Reset form
      setNewModuleTitle('');
      setNewModuleDescription('');
      setShowModuleCreator(false);

      toast.success("Module Created Successfully!", {
        description: `"${newModule.title}" has been added to the course.`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error creating module:', err);
      setModuleCreationError(err instanceof Error ? err.message : 'Failed to create module');
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleCancelModuleCreation = () => {
    setShowModuleCreator(false);
    setNewModuleTitle('');
    setNewModuleDescription('');
    setModuleCreationError(null);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return;
    }

    if (!courseId) return;

    try {
      await apiService.deleteModule(parseInt(courseId), moduleId);
      setModules(prev => prev.filter(module => module.id !== moduleId));

      toast.success("Module deleted successfully");
    } catch (err) {
      console.error('Error deleting module:', err);
      toast.error('Failed to delete module');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/management-dashboard');
  };

  const handleEditCourse = () => {
    router.push(`/modify-course?id=${courseId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={handleBackToDashboard} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleBackToDashboard} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-muted-foreground">
                Add and manage modules for this course
              </p>
            </div>
          </div>
          <Button onClick={handleEditCourse} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
        </div>

        {/* Course Description */}
        {course?.body && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.body}</p>
            </CardContent>
          </Card>
        )}

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Modules ({modules.length})
                </CardTitle>
                <CardDescription>
                  Create and organize modules for your course content
                </CardDescription>
              </div>
              <Button onClick={() => setShowModuleCreator(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Module Creator */}
            {showModuleCreator && (
              <Card className="mb-6 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Module</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="module-title">Module Title *</Label>
                    <Input
                      id="module-title"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Enter module title..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="module-description">Module Description</Label>
                    <Textarea
                      id="module-description"
                      value={newModuleDescription}
                      onChange={(e) => setNewModuleDescription(e.target.value)}
                      placeholder="Enter module description..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  {moduleCreationError && (
                    <p className="text-red-600 text-sm">{moduleCreationError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateModule} 
                      disabled={isCreatingModule || !newModuleTitle.trim()}
                    >
                      {isCreatingModule ? 'Creating...' : 'Create Module'}
                    </Button>
                    <Button 
                      onClick={handleCancelModuleCreation} 
                      variant="outline"
                      disabled={isCreatingModule}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modules List */}
            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={module.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                              Module {index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                          {module.body && (
                            <p className="text-muted-foreground mb-3">{module.body}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Content blocks: {module.contentCount || 0}</span>
                            <span>Progress: {Math.round((module.progress || 0) * 100)}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => router.push(`/modify-course?id=${courseId}&moduleId=${module.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Add Content
                          </Button>
                          <Button
                            onClick={() => handleDeleteModule(module.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No modules yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your course by creating your first module
                </p>
                {!showModuleCreator && (
                  <Button onClick={() => setShowModuleCreator(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Module
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddModulesPage;
