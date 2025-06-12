import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile"; // Update if path differs

interface LayoutProps {
  children: React.ReactNode;
}

const translations = {
  English: {
    sidebar: [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/employee", label: "Employee", icon: "🧑‍💼" },
      { path: "/worklog", label: "Work Log", icon: "🕒" },
      { path: "/payroll", label: "Payroll", icon: "💵" },
      { path: "/expense-income", label: "Expense & Income", icon: "💳" },
      { path: "/reports", label: "Reports", icon: "📈" },
    ],
    searchPlaceholder: "Search",
    logout: "Log out",
  },
  Burmese: {
    sidebar: [
      { path: "/dashboard", label: "ပန်းတိုင်စာမျက်နှာ", icon: "📊" },
      { path: "/employee", label: "ဝန်ထမ်း", icon: "🧑‍💼" },
      { path: "/worklog", label: "အလုပ်မှတ်တမ်း", icon: "🕒" },
      { path: "/payroll", label: "လစာ", icon: "💵" },
      { path: "/expense-income", label: "ကုန်ကျစရိတ်နှင့် ဝင်ငွေ", icon: "💳" },
      { path: "/reports", label: "အစီရင်ခံစာများ", icon: "📈" },
    ],
    searchPlaceholder: "ရှာဖွေပါ",
    logout: "ထွက်ရန်",
  },
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"English" | "Burmese">("English");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sidebarItems = translations[language].sidebar;
  const isMobile = useIsMobile();

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: "English" | "Burmese") => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white overflow-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-[80px] px-4 md:px-8 border-b border-[#E5E5E5] bg-[#F8F8F8] gap-2 sm:gap-0">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div className="flex items-center text-[28px] font-semibold font-inter">
            <span className="text-[#FF6767]">TDA</span>
            <span className="text-black">: HR</span>
          </div>

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#FF6767]"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>

        {/* Search and Language */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center w-full max-w-xs px-4 py-[8px] rounded-[10px] outline outline-1 outline-[#FF676733]">
            <Search size={20} className="text-[#FF6767] mr-2" />
            <input
              type="text"
              placeholder={translations[language].searchPlaceholder}
              className="bg-transparent placeholder-[#16151C33] text-[16px] font-light leading-[24px] focus:outline-none w-full"
            />
          </div>

          <div
            ref={dropdownRef}
            className="flex items-center justify-center h-[38px] px-3 rounded-[10px] outline outline-1 outline-[#FF676733] gap-2 relative cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-[#16151C] text-[14px] font-light">{language}</span>
            <ChevronDown size={18} className="text-[#16151C]" />
            {dropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded shadow-md w-[120px] z-10">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
                  onClick={() => handleSelectLanguage("English")}
                >
                  English
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
                  onClick={() => handleSelectLanguage("Burmese")}
                >
                  Burmese
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isMobile
              ? `fixed top-[80px] left-0 h-[calc(100vh-80px)] w-[260px] bg-[#FAFAFA] pt-4 px-4 border-r border-gray-200 z-20 transform transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "hidden sm:flex flex-col w-[260px] bg-[#FAFAFA] pt-4 px-4 border-r border-gray-200"
          }`}
        >
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center w-full h-[44px] pl-4 rounded-r-[10px] transition-all duration-150 ${
                  location.pathname === item.path
                    ? "bg-[rgba(255,103,103,0.05)] text-[#FF6767] font-semibold"
                    : "text-[#16151C] font-light hover:bg-gray-100"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-[3px] rounded-[10px] ${
                    location.pathname === item.path ? "bg-[#FF6767]" : "opacity-0"
                  }`}
                />
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-[15px] leading-[22px]">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 bg-[#FF6767] text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              <LogOut size={16} className="mr-2" />
              {translations[language].logout}
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-10"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 overflow-y-auto ${isMobile ? "mt-[80px]" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
