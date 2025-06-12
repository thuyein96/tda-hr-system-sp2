
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Employee from "@/pages/Employee";
import WorkLog from "@/pages/WorkLog";
import Payroll from "@/pages/Payroll";
import ExpenseIncome from "@/pages/ExpenseIncome";
import Reports from "@/pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/employee" element={<Layout><Employee /></Layout>} />
          <Route path="/worklog" element={<Layout><WorkLog /></Layout>} />
          <Route path="/payroll" element={<Layout><Payroll /></Layout>} />
          <Route path="/expense-income" element={<Layout><ExpenseIncome /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
