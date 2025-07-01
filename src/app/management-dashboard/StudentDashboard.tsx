'use client';

import { useState} from 'react'
import CourseCard, { Course } from "@/components/content/CourseCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/content/Navigation";
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";

export default function StudentDashboard() {

  const mockCourses: Course[] = [
    {
      id: "1",
      title: "Digital Marketing Fundamentals",
      description:
        "Learn the basics of digital marketing including SEO, social media, and content strategy.",
      duration: "4 weeks",
      modules: 8,
      progress: 75,
      status: "in-progress",
      dueDate: "2024-02-15",
      category: "Marketing",
    },
    {
      id: "2",
      title: "Data Analytics for Business",
      description:
        "Master data analysis techniques and tools to make informed business decisions.",
      duration: "6 weeks",
      modules: 12,
      progress: 100,
      status: "completed",
      category: "Analytics",
    },
    {
      id: "3",
      title: "Leadership Communication",
      description:
        "Develop effective communication skills for leadership roles and team management.",
      duration: "3 weeks",
      modules: 6,
      progress: 0,
      status: "not-started",
      dueDate: "2024-03-01",
      category: "Leadership",
    },
    {
      id: "4",
      title: "Project Management Essentials",
      description:
        "Learn project management methodologies and tools to deliver successful projects.",
      duration: "5 weeks",
      modules: 10,
      progress: 30,
      status: "in-progress",
      dueDate: "2024-02-28",
      category: "Management",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCourseAction = (course: Course) => {
    console.log("Opening course:", course.title);
    // Navigate to course details page
  };

  // Calculate statistics
  const totalCourses = mockCourses.length;
  const completedCourses = mockCourses.filter(
    (c) => c.status === "completed",
  ).length;
  const inProgressCourses = mockCourses.filter(
    (c) => c.status === "in-progress",
  ).length;
  const averageProgress = Math.round(
    mockCourses.reduce((sum, course) => sum + (course.progress || 0), 0) /
      totalCourses,
  );

  return (
    <Navigation>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Learning Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue your professional development
            journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">Courses finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="text-xs text-muted-foreground">
                Currently learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Learning Progress
            </CardTitle>
            <CardDescription>
              Your progress across all assigned courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{averageProgress}%</span>
              </div>
              <Progress value={averageProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {completedCourses}/{totalCourses} courses completed
                </span>
                <span>{inProgressCourses} in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <Badge variant="outline">
              {filteredCourses.length} of {totalCourses} courses
            </Badge>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onAction={handleCourseAction}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "You haven't been assigned any courses yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Navigation>
  )
}