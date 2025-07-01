
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Play, CheckCircle } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  enrolled?: number;
  progress?: number;
  status?: "not-started" | "in-progress" | "completed";
  dueDate?: string;
  category: string;
}

interface CourseCardProps {
  course: Course;
  isTeacher?: boolean;
  onAction?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isTeacher = false,
  onAction,
}) => {
  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
          {!isTeacher && course.status && (
            <Badge variant="outline" className={getStatusColor(course.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(course.status)}
                {formatStatus(course.status)}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.modules} modules</span>
          </div>
          {isTeacher && course.enrolled !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolled} enrolled</span>
            </div>
          )}
        </div>

        <Badge variant="secondary" className="w-fit mt-2">
          {course.category}
        </Badge>
      </CardHeader>

      <CardContent className="pt-0">
        {!isTeacher && course.progress !== undefined && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {course.dueDate && !isTeacher && (
          <div className="text-sm text-muted-foreground mb-4">
            Due: {new Date(course.dueDate).toLocaleDateString()}
          </div>
        )}

        <Button
          variant={isTeacher ? "outline" : "default"}
          className="w-full"
          onClick={() => onAction?.(course)}
        >
          {isTeacher
            ? "Manage Course"
            : course.status === "completed"
              ? "Review Course"
              : course.status === "in-progress"
                ? "Continue Learning"
                : "Start Course"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
