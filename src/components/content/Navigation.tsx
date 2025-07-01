import React from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  Settings,
  User,
} from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
 
  // const location = useLocation();

  const isTeacher =  "student";

  const navigation = isTeacher
    ? [
        { name: "Dashboard", href: "/teacher/dashboard", icon: BarChart3 },
        { name: "Courses", href: "/teacher/courses", icon: BookOpen },
        { name: "Students", href: "/teacher/students", icon: Users },
        { name: "Settings", href: "/teacher/settings", icon: Settings },
      ]
    : [
        { name: "Dashboard", href: "/student/dashboard", icon: BookOpen },
        { name: "My Progress", href: "/student/progress", icon: BarChart3 },
        { name: "Profile", href: "/student/profile", icon: User },
      ];

  return (
    <div style={{minHeight: "100vh"}}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                LearnSpace
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Welcome back, </span>
              <span className="font-medium text-foreground">{}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div
                className={`h-2 w-2 rounded-full ${isTeacher ? "bg-blue-500" : "bg-green-500"}`}
              />
              <span className="capitalize">{}</span>
            </div>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-muted/30 border-r border-border">
          <nav className="p-4 space-y-2">
            {/* {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })} */}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
