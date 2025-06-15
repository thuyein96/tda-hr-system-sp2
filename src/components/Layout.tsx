import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile"; // Assuming this hook exists
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext"; // Assuming this context exists

interface LayoutProps {
  children: React.ReactNode;
  setIsLoggedIn: (value: boolean) => void; // This prop is essential for logout functionality
}

const LayoutContent = ({ children, setIsLoggedIn }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, translations, allTranslations } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null); // Ref to measure header height dynamically

  const sidebarItems = translations.sidebar; // Assuming translations.sidebar is correctly structured
  const isMobile = useIsMobile(); // Custom hook to detect mobile view
  const [headerHeight, setHeaderHeight] = useState(80); // Default desktop header height

  // Date formatting for the header
  const today = new Date();
  const day = today.toLocaleDateString(language === "English" ? "en-US" : "my-MM", {
    weekday: "long",
  });
  const date = today.toLocaleDateString(language === "English" ? "en-GB" : "my-MM");

  // Handles the logout action
  const handleLogout = () => {
    setIsLoggedIn(false); // Set global login status to false
    navigate("/"); // Redirect to the login page
  };

  // Effect to close language dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect to update header height on mount and window resize
  // This ensures the main content below the fixed header is always correctly positioned.
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight(); // Initial height calculation
    window.addEventListener('resize', updateHeaderHeight); // Listen for resize events
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []); // Empty dependency array means this runs once on mount and on unmount

  // Effect to close the mobile sidebar automatically when navigating to a new route
  useEffect(() => {
    if (isMobile && sidebarOpen) { // Only close if it's mobile and the sidebar is currently open
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, sidebarOpen]); // Dependencies to re-run effect on route or mobile state change

  // Handles selection of language from the dropdown
  const handleSelectLanguage = (lang: "English" | "Burmese") => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white overflow-hidden">
      {/* Fixed Header */}
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-30 flex flex-col sm:flex-row sm:h-[80px] items-center justify-between px-4 md:px-8 border-b border-[#E5E5E5] bg-[#F8F8F8] py-3">
        {/* Mobile: Logo & Hamburger. Desktop: Logo and other elements on one line */}
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div className="flex items-center text-[28px] font-semibold font-inter">
            <span className="text-[#FF6767]">TDA</span>
            <span className="text-black">: HR</span>
          </div>

          {isMobile && ( // Show hamburger/X button only on mobile
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#FF6767]"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>

        {/* Conditional rendering for mobile vs desktop header content */}
        {isMobile ? (
          // Mobile-specific layout for search and language: on the same line
          <div className="flex items-center w-full mt-2 gap-2"> {/* Container for search and language */}
            {/* Search Bar - Takes available width */}
            <div className="flex items-center flex-grow px-4 py-[8px] rounded-[10px] outline outline-1 outline-[#FF676733]">
              <Search size={20} className="text-[#FF6767] mr-2" />
              <input
                type="text"
                placeholder={translations.searchPlaceholder}
                className="bg-transparent placeholder-[#16151C33] text-[16px] font-light leading-[24px] focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Language Dropdown - Maintains its size */}
            <div
              ref={dropdownRef}
              className="flex items-center justify-center h-[38px] px-3 rounded-[10px] outline outline-1 outline-[#FF676733] gap-2 relative cursor-pointer select-none flex-shrink-0"
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
        ) : (
          // Desktop elements: Search, Language, Date/Time (all in one row)
          <div className="flex items-center gap-4">
            {/* Search Bar (Desktop) */}
            <div className="flex items-center w-full max-w-xs px-4 py-[8px] rounded-[10px] outline outline-1 outline-[#FF676733]">
              <Search size={20} className="text-[#FF6767] mr-2" />
              <input
                type="text"
                placeholder={translations.searchPlaceholder}
                className="bg-transparent placeholder-[#16151C33] text-[16px] font-light leading-[24px] focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Language Dropdown (Desktop) */}
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

            {/* Date and Time (Desktop) */}
            <div className="text-right">
              <div className="text-[15px] text-black font-medium font-inter">{day}</div>
              <div className="text-[14px] text-[#3ABEFF] font-medium font-inter">{date}</div>
            </div>
          </div>
        )}
      </header>

      {/* Main content wrapper, shifted down by dynamic header height */}
      <div className="flex flex-1" style={{ marginTop: `${headerHeight}px` }}>
        {/* Sidebar */}
        <aside
          className={`${
            isMobile
              ? `fixed top-0 left-0 h-screen w-[260px] bg-[#FAFAFA] pt-4 px-4 border-r border-gray-200 z-20 transform transition-transform duration-300 ${
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
                // Add onClick handler to close sidebar when a link is clicked on mobile
                onClick={() => isMobile && setSidebarOpen(false)}
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
              onClick={handleLogout} // Calls the handleLogout function to log out
              className="flex items-center justify-center w-full px-4 py-2 bg-[#FF6767] text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              <LogOut size={16} className="mr-2" />
              {translations.logout}
            </button>
          </div>
        </aside>

        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-10"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area: Padding is applied here for the entire content area */}
        <main className={`flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50`}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                currentPath: location.pathname,
                searchQuery: searchQuery,
              });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
};

// Layout component, wrapping LayoutContent with LanguageProvider
const Layout = ({ children, setIsLoggedIn }: LayoutProps) => (
  <LanguageProvider>
    <LayoutContent setIsLoggedIn={setIsLoggedIn}>{children}</LayoutContent>
  </LanguageProvider>
);

export default Layout;