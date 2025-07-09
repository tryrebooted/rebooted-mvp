'use client'

import React, { useState } from "react";
import Layout from "@/components/content/Layout";
import CreateCourseDialog, {
  CourseFormData,
} from "@/components/content/CreateCourseDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, BarChart3, Plus, CheckCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {toast} from "sonner"

const TeacherDashboard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [recentCourses, setRecentCourses] = useState<CourseFormData[]>([]);

  const handleCourseCreated = (courseData: CourseFormData) => {
    setRecentCourses((prev) => [courseData, ...prev.slice(0, 2)]);
  
    toast.success("Course Created Successfully!", {
      description: `"${courseData.title}" has been created and is ready for content.`,
      duration: 5000,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">
              Course Management
            </h1>
            <p className="">
              Manage your courses and track student progress
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2 " />
            Create Course
          </Button>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {12 + recentCourses.length}
              </div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">Enrolled learners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                Average completion
              </p>
            </CardContent>
          </Card>
        </div> */}

        {/* Recent Courses */}
        {recentCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <CheckCircle className="h-5 w-5 text-green-600" /> */}
                Recently Created Courses
              </CardTitle>
              {/* <CardDescription>Your latest course creations</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div
                    key={index}
                    className="justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {/* <Badge variant="secondary">{course.category}</Badge> */}
                        <span>•</span>
                        <span>{course.category}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                        {/* <span>•</span> */}
                        {/* <span>{course.difficulty}</span> */}
                        {/* <span>•</span> */}
                        {/* <span>Max {course.maxStudents} students</span> */}
                      </div>
                      {course.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {course.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Button className="mt-2" variant="outline" size="sm">
                      Add Content
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Management Dashboard</CardTitle>
            <CardDescription>
              {recentCourses.length > 0
                ? "Great start! Continue building your courses by adding modules and content."
                : "Create your first course to get started with course management."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              {/* <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> */}
              <h3 className="text-lg mb-2">
                {recentCourses.length > 0
                  ? "Ready to Add Course Content"
                  : "Create Your First Course"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {recentCourses.length > 0
                  ? "Start adding modules, lessons, and assignments to your courses."
                  : "Click the 'Create Course' button to design your first learning program."}
              </p>
              {recentCourses.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Course Dialog */}
        <CreateCourseDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCourseCreated={handleCourseCreated}
        />
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
