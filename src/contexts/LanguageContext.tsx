import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

// Define specific types for translation structure for better type safety
interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

interface EmployeePageTranslations {
  totalEmployee: string;
  active: string;
  onLeave: string;
  allEmployees: string;
  sortBy: string;
  joinDate: string;
  addNewEmployee: string;
  showing: string;
  of: string;
  employees: string;
  fullNameColumn: string;
  employeeIdColumn: string;
  phoneNumberColumn: string;
  roleColumn: string;
  joinDateColumn: string;
  statusColumn: string;
  actionColumn: string;
  editButton: string;
  // --- NEW MODAL TRANSLATION KEYS ---
  addNewEmployeeTitle: string;
  fullNamePlaceholder: string;
  baseRatePlaceholder: string;
  phoneNumberPlaceholder: string;
  rolePlaceholder: string;
  joinDatePlaceholder: string;
  selectTypeLabel: string;
  activeStatus: string;
  onLeaveStatus: string;
  cancelButton: string;
  addButton: string;
  // --- NEW EDIT/DELETE MODAL TRANSLATION KEYS (using ReactNode for flexibility) ---
  editEmployeeTitle: ReactNode;
  saveChangesButton: ReactNode;
  confirmDeleteTitle: ReactNode;
  confirmDeleteMessage1: ReactNode;
  confirmDeleteMessage2: ReactNode;
  deleteButton: ReactNode;
}

// Full translations structure used by the context
interface AppTranslations {
  sidebar: SidebarItem[];
  searchPlaceholder: string;
  logout: string;
  employeePage: EmployeePageTranslations; // Nested object for employee page translations
  // Add other page translations here as you expand your app
}

interface AllTranslationsCollection {
  English: AppTranslations;
  Burmese: AppTranslations;
}

// Define the shape of the context value
interface LanguageContextType {
  language: "English" | "Burmese";
  setLanguage: Dispatch<SetStateAction<"English" | "Burmese">>;
  translations: AppTranslations; // The currently selected language's translations
  allTranslations: AllTranslationsCollection; // All available translations (useful if you need to display language names)
}

// Global translation data
const allAppTranslations: AllTranslationsCollection = {
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
    employeePage: {
      totalEmployee: "Total Employee",
      active: "Active",
      onLeave: "On Leave",
      allEmployees: "All Employees",
      sortBy: "Sort by:",
      joinDate: "Join Date",
      addNewEmployee: "Add New Employee",
      showing: "Showing",
      of: "of",
      employees: "employees",
      fullNameColumn: "Full Name",
      employeeIdColumn: "Employee ID",
      phoneNumberColumn: "Phone Number",
      roleColumn: "Role",
      joinDateColumn: "Join Date",
      statusColumn: "Status",
      actionColumn: "Action",
      editButton: "Edit",
      // --- NEW MODAL TRANSLATIONS ---
      addNewEmployeeTitle: "Add new employee",
      fullNamePlaceholder: "Full Name",
      baseRatePlaceholder: "Base rate",
      phoneNumberPlaceholder: "Phone number",
      rolePlaceholder: "Role",
      joinDatePlaceholder: "Join date (DD/MM/YYYY)",
      selectTypeLabel: "Select Type",
      activeStatus: "Active",
      onLeaveStatus: "On Leave",
      cancelButton: "Cancel",
      addButton: "Add",
      // --- NEW EDIT/DELETE MODAL TRANSLATIONS ---
      editEmployeeTitle: "Edit Employee",
      saveChangesButton: "Save Changes",
      confirmDeleteTitle: "Confirm Deletion",
      confirmDeleteMessage1: "Are you sure you want to delete",
      confirmDeleteMessage2: "? This action cannot be undone.",
      deleteButton: "Delete",
    },
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
    employeePage: {
      totalEmployee: "ဝန်ထမ်းစုစုပေါင်း",
      active: "လုပ်ငန်းခွင်ဝင်",
      onLeave: "ခွင့်ယူထား",
      allEmployees: "ဝန်ထမ်းအားလုံး",
      sortBy: "စီစစ်ရန်:",
      joinDate: "ဝင်ရောက်သည့်နေ့စွဲ",
      addNewEmployee: "ဝန်ထမ်းအသစ်ထည့်ရန်",
      showing: "ပြသနေသည်",
      of: "၏",
      employees: "ဝန်ထမ်းများ",
      fullNameColumn: "အမည်အပြည့်အစုံ",
      employeeIdColumn: "ဝန်ထမ်း ID",
      phoneNumberColumn: "ဖုန်းနံပါတ်",
      roleColumn: "ရာထူး",
      joinDateColumn: "ပူးပေါင်းသည့်နေ့",
      statusColumn: "အခြေအနေ",
      actionColumn: "လုပ်ဆောင်ချက်",
      editButton: "ပြင်ဆင်ရန်",
      // --- NEW MODAL TRANSLATIONS ---
      addNewEmployeeTitle: "ဝန်ထမ်းအသစ်ထည့်ရန်",
      fullNamePlaceholder: "အမည်အပြည့်အစုံ",
      baseRatePlaceholder: "အခြေခံနှုန်း",
      phoneNumberPlaceholder: "ဖုန်းနံပါတ်",
      rolePlaceholder: "ရာထူး",
      joinDatePlaceholder: "ပူးပေါင်းသည့်နေ့ (DD/MM/YYYY)",
      selectTypeLabel: "အမျိုးအစားရွေးပါ",
      activeStatus: "လုပ်ငန်းခွင်ဝင်",
      onLeaveStatus: "ခွင့်ယူထား",
      cancelButton: "ပယ်ဖျက်ရန်",
      addButton: "ထည့်ရန်",
      // --- NEW EDIT/DELETE MODAL TRANSLATIONS ---
      editEmployeeTitle: "ဝန်ထမ်းပြင်ဆင်ရန်",
      saveChangesButton: "အပြောင်းအလဲများ သိမ်းဆည်းရန်",
      confirmDeleteTitle: "ဖျက်ရန် အတည်ပြုပါ",
      confirmDeleteMessage1: "ဖျက်ရန်သေချာပါသလား",
      confirmDeleteMessage2: " ဤလုပ်ဆောင်ချက်ကို ပြန်ဖျက်၍မရပါ။",
      deleteButton: "ဖျက်ရန်",
    },
  },
};

// Create the context with a default undefined value (will be set by provider)
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component to wrap your application or part of it
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<"English" | "Burmese">("English");

  const translations = allAppTranslations[language];

  const contextValue = {
    language,
    setLanguage,
    translations, // Current language translations
    allTranslations: allAppTranslations, // All translations for potential future use (e.g., in language switcher)
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to easily consume the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};