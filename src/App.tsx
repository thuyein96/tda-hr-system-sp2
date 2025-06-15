import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';

// Your page components and general components
import LoginPage from "@/pages/Index"; // This path should point to your login page component (e.g., src/pages/Index.tsx)
import NotFound from "@/pages/NotFound"; // Your 404 page
import Layout from "@/components/Layout"; // Your main application layout
import Dashboard from "@/pages/Dashboard";
import Employee from "@/pages/Employee";
import WorkLog from "@/pages/WorkLog";
import Payroll from "@/pages/Payroll";
import ExpenseIncome from "@/pages/ExpenseIncome";
import Reports from "@/pages/Reports";

const queryClient = new QueryClient();

const App = () => {
  // Authentication state managed at the top level of the application
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ProtectedElement is a helper component defined inline.
  // It checks the isLoggedIn state and either renders its children (protected content)
  // or redirects the user to the login page.
  const ProtectedElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isLoggedIn) {
      // If the user is not logged in, redirect them to the root path (login page)
      return <Navigate to="/" replace />;
    }
    // If the user is logged in, render the content (the protected route's component)
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/*
              The Login Route:
              - This route ("/") is NOT protected, so it's always accessible.
              - It renders the LoginPage component.
              - It passes the `setIsLoggedIn` function to LoginPage, allowing LoginForm
                (nested inside LoginPage) to update the global authentication state upon successful login.
            */}
            <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

            {/*
              Protected Routes:
              - All routes defined below this point are wrapped by `ProtectedElement`.
              - `ProtectedElement` acts as a guard, ensuring only logged-in users can access these paths.
              - The `Layout` component wraps the actual page content (e.g., Dashboard, Employee).
              - `setIsLoggedIn` is also passed to `Layout` to enable the "Logout" functionality within the app layout.
            */}

            <Route
              path="/dashboard"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <Dashboard />
                  </Layout>
                </ProtectedElement>
              }
            />
            <Route
              path="/employee"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <Employee />
                  </Layout>
                </ProtectedElement>
              }
            />
            <Route
              path="/worklog"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <WorkLog />
                  </Layout>
                </ProtectedElement>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <Payroll />
                  </Layout>
                </ProtectedElement>
              }
            />
            <Route
              path="/expense-income"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <ExpenseIncome />
                  </Layout>
                </ProtectedElement>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedElement>
                  <Layout setIsLoggedIn={setIsLoggedIn}>
                    <Reports />
                  </Layout>
                </ProtectedElement>
              }
            />

            {/*
              The Not Found Route:
              - This route ("*") catches any undefined paths.
              - It's typically not protected, as it provides a fallback for invalid URLs.
            */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;