'use client'

import React, { useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, Plus, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { mockAuth } from "@/contexts/UserContext";
import { Course, Module, ContentResponse } from "@/types/backend-api";
import ContentBlockList from "@/components/content/ContentBlockList";
import EnhancedContentCreator from "@/components/content/EnhancedContentCreator";

const AddContentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const moduleId = searchParams.get('moduleId');

  // State management
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Content creation state
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [addContentToList, setAddContentToList] = useState<((newContent: ContentResponse) => void) | null>(null);

  // Load course and module data
  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setIsLoading(false);
      return;
    }

    if (!moduleId) {
      setError('Module ID is required');
      setIsLoading(false);
      return;
    }

    loadData();
  }, [courseId, moduleId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user to check permissions
      const { data: { user }, error: userError } = await mockAuth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Load course details and specific module in parallel
      const [courseData, moduleData] = await Promise.all([
        apiService.getCourseById(parseInt(courseId!)),
        apiService.getModuleById(parseInt(courseId!), parseInt(moduleId!))
      ]);

      setCourse(courseData);
      setSelectedModule(moduleData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course and module data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/management-dashboard');
  };

  const handleBackToModules = () => {
    router.push(`/add-modules?id=${courseId}`);
  };

  const handlePreviewCourse = () => {
    router.push(`/preview-course?id=${courseId}`);
  };

  const handleShowContentCreator = () => {
    setShowContentCreator(true);
  };

  const handleHideContentCreator = () => {
    setShowContentCreator(false);
  };

  const handleContentCreated = (newContent: ContentResponse) => {
    setShowContentCreator(false);
    toast.success("Content created successfully!");

    // Add the new content directly to the list if the function is available
    if (addContentToList) {
      addContentToList(newContent);
    } else {
      // Fallback to refresh if direct add is not available
      handleContentUpdate();
    }
  };

  const handleContentUpdate = () => {
    // Refresh module data when content is updated to reflect progress changes
    loadData();
  };

  const handleAddContentCallback = useCallback((addContentFn: (newContent: ContentResponse) => void) => {
    setAddContentToList(() => addContentFn);
  }, []);

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
              onClick={handleBackToModules}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-muted-foreground">
                {selectedModule ? `Add and manage content for "${selectedModule.title}"` : 'Loading module...'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePreviewCourse} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Preview Course
            </Button>
            <Button onClick={handleBackToDashboard} variant="outline">
              Back to Dashboard
            </Button>
          </div>
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

        {/* Content Management Area */}
        {selectedModule ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {selectedModule.title} - Content
                  </CardTitle>
                  <CardDescription>
                    Manage content blocks for this module
                  </CardDescription>
                </div>
                {!showContentCreator && (
                  <Button onClick={handleShowContentCreator}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Item
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Content Creator */}
              {showContentCreator && (
                <div className="mb-6">
                  <EnhancedContentCreator
                    moduleId={selectedModule.id}
                    onContentCreated={handleContentCreated}
                    onCancel={handleHideContentCreator}
                  />
                </div>
              )}

              {/* Content Block List */}
              <ContentBlockList
                moduleId={selectedModule.id}
                moduleName={selectedModule.title}
                isInteractive={true}
                onContentUpdate={handleContentUpdate}
                onAddContent={handleAddContentCallback}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Module Not Found</h3>
                <p className="text-muted-foreground mb-4">
                  The requested module could not be loaded
                </p>
                <Button onClick={handleBackToModules}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Modules
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AddContentPage;
