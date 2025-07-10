import React, { createContext, useContext } from "react";

// Define a mock user (change role to 'student' or 'teacher' as needed)
const mockUser = {
  name: "Jane Doe",
  role: "teacher", // or 'student'
};

// Create the context shape
const AuthContext = createContext({
  user: mockUser,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Dummy logout function
  const logout = () => {
    alert("Logged out (mock)");
  };

  return (
    <AuthContext.Provider value={{ user: mockUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 