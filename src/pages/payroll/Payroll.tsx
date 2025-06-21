// src/pages/Payroll.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DollarSign, FileText, Plus, ChevronDown, Edit, X, ChevronLeft, ChevronRight, Calculator, Minus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext'; // Adjust path as necessary
import { useSearchParams } from 'react-router-dom'; // For global search
// Define missing types here since './WorkLog' does not exist
export interface EmployeeResponse {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  position: string;
  joinedDate: string;
}

export interface WorkLogData {
  _id: string;
  employeeId: string;
  fullName: string;
  productRate: number;
  quantity: number;
  role: string;
  date: string; // YYYY-MM-DD
  status: string;
  note: string;
}

// --- Date Utility Functions ---
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Ensure the date is treated as UTC to avoid timezone issues affecting day calculations
  return new Date(Date.UTC(year, month - 1, day));
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday (1)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(Date.UTC(startOfWeek.getUTCFullYear(), startOfWeek.getUTCMonth(), startOfWeek.getUTCDate() + 6));
  return endOfWeek;
};

const getStartOfMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
};

const getEndOfMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)); // Day 0 of next month is last day of current month
};

const isDateInRange = (dateString: string, startDate: string, endDate: string): boolean => {
  const date = parseDate(dateString);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  // Compare timestamps
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
};

// --- Mock Data Services ---
// (Assume these would be replaced by actual API calls)
// Mock Worklog Service - Only providing completed worklogs for payroll calculation
const mockWorklogService = {
  getCompletedWorklogs: async (): Promise<WorkLogData[]> => {
    const initialWorkLogData: WorkLogData[] = [
      {
        _id: 'wl-001', employeeId: '6674e2d3122c6c31f4e0c4b2', fullName: 'Kyaw',
        productRate: 2.5, quantity: 1000, role: 'Plastic Producer', date: '2025-04-29',
        status: 'Completed', note: '20 quantity errored.'
      },
      {
        _id: 'wl-004', employeeId: '6674e2d3122c6c31f4e0c4b3', fullName: 'Aung Aung',
        productRate: 3, quantity: 800, role: 'Packaging', date: '2025-05-03',
        status: 'Completed', note: ''
      },
      {
        _id: 'wl-005_bonus', employeeId: '6674e2d3122c6c31f4e0c4b4', fullName: 'Su Su',
        productRate: 5, quantity: 300, role: 'Quality Control', date: '2025-05-04',
        status: 'Completed', note: 'Bonus included'
      },
       {
        _id: 'wl-006', employeeId: '6674e2d3122c6c31f4e0c4b2', fullName: 'Kyaw',
        productRate: 2.5, quantity: 500, role: 'Plastic Producer', date: '2025-04-30',
        status: 'Completed', note: 'Additional quantity'
      },
      {
        _id: 'wl-007', employeeId: '6674e2d3122c6c31f4e0c4b2', fullName: 'Kyaw',
        productRate: 2.5, quantity: 200, role: 'Plastic Producer', date: '2025-06-21', // Example for current week/day
        status: 'Completed', note: 'Recent entry.'
      },
      {
        _id: 'wl-008', employeeId: '6674e2d3122c6c31f4e0c4b3', fullName: 'Aung Aung',
        productRate: 3, quantity: 150, role: 'Packaging', date: '2025-06-20', // Example for current week/day
        status: 'Completed', note: 'Recent entry.'
      },
      {
        _id: 'wl-009', employeeId: '6674e2d3122c6c31f4e0c4b4', fullName: 'Su Su',
        productRate: 5, quantity: 50, role: 'Quality Control', date: '2025-06-19', // Example for current week/day
        status: 'Completed', note: 'Recent entry.'
      },
      {
        _id: 'wl-010', employeeId: '6674e2d3122c6c31f4e0c4b2', fullName: 'Kyaw',
        productRate: 2.0, quantity: 800, role: 'Plastic Producer', date: '2025-06-22', // Today
        status: 'Completed', note: 'Today production.'
      },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(initialWorkLogData.filter(log => log.status === 'Completed'));
      }, 700); // Simulate network delay
    });
  }
};

const mockEmployeeService = {
  getAllEmployees: async (): Promise<EmployeeResponse[]> => {
    const employees: EmployeeResponse[] = [
      { _id: '6674e2d3122c6c31f4e0c4b2', name: 'Kyaw', phoneNumber: '09123456789', address: 'Yangon', position: 'Plastic Producer', joinedDate: '2023-01-15' },
      { _id: '6674e2d3122c6c31f4e0c4b3', name: 'Aung Aung', phoneNumber: '09876543210', address: 'Mandalay', position: 'Packaging', joinedDate: '2022-11-01' },
      { _id: '6674e2d3122c6c31f4e0c4b4', name: 'Su Su', phoneNumber: '09112233445', address: 'Naypyidaw', position: 'Quality Control', joinedDate: '2024-03-20' },
      { _id: '6674e2d3122c6c31f4e0c4b5', name: 'Mya Mya', phoneNumber: '09556677889', address: 'Taunggyi', position: 'Bottle Producer', joinedDate: '2023-09-10' },
    ];
    return new Promise(resolve => {
      setTimeout(() => resolve(employees), 500);
    });
  }
};

// --- Payroll Data Interface (UPDATED: Added paidStatus) ---
interface PayrollEntry {
  id: string;
  employeeId: string;
  fullName: string;
  totalQuantity: number;
  totalProductRate: number; // Sum of product rates if multiple tasks, or average
  calculatedSalary: number; // productRate * quantity for each completed worklog summed up
  bonusDeduction: number; // Positive for bonus, negative for deduction
  netSalary: number;
  payrollPeriod: string; // e.g., "2025-06" or "2025-06-01 to 2025-06-30"
  paidStatus: 'Paid' | 'Unpaid'; // NEW: Paid status
}

// --- Bonus/Deduction Modal Component ---
interface BonusDeductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollEntry: PayrollEntry | null;
  onSave: (id: string, newBonusDeduction: number, note: string) => void;
}

const BonusDeductionModal = ({ isOpen, onClose, payrollEntry, onSave }: BonusDeductionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.payrollPage;

  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'bonus' | 'deduction'>('bonus');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (isOpen && payrollEntry) {
      if (payrollEntry.bonusDeduction !== 0) {
        const absAmount = Math.abs(payrollEntry.bonusDeduction);
        setAmount(absAmount.toString());
        setType(payrollEntry.bonusDeduction > 0 ? 'bonus' : 'deduction');
      } else {
        setAmount('');
        setType('bonus');
      }
      setNote('');
    }
  }, [isOpen, payrollEntry]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !payrollEntry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      alert(modalTranslations.invalidAmount);
      return;
    }

    const finalAmount = type === 'bonus' ? numAmount : -numAmount;
    onSave(payrollEntry.id, finalAmount, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {modalTranslations.addBonusDeductionTitle} ({payrollEntry.fullName})
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.type}</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="bonus"
                  checked={type === 'bonus'}
                  onChange={() => setType('bonus')}
                  className="form-radio text-[#FF6767] focus:ring-[#FF6767]"
                />
                <span className="ml-2 text-gray-700">{modalTranslations.bonus}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="deduction"
                  checked={type === 'deduction'}
                  onChange={() => setType('deduction')}
                  className="form-radio text-[#FF6767] focus:ring-[#FF6767]"
                />
                <span className="ml-2 text-gray-700">{modalTranslations.deduction}</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.amount}</label>
            <input
              type="number"
              id="amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
              min="0"
              step="any"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.notePlaceholder} ({modalTranslations.optional})</label>
            <textarea
              id="note"
              placeholder={modalTranslations.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-y min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              {modalTranslations.cancelButton}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF6767] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              {modalTranslations.saveButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Payroll Component ---
const Payroll = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBonusDeductionModalOpen, setIsBonusDeductionModalOpen] = useState(false);
  const [selectedPayrollEntry, setSelectedPayrollEntry] = useState<PayrollEntry | null>(null);

  // NEW: Period selection states
  const [periodType, setPeriodType] = useState<'month' | 'week' | 'day' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [currentDisplayPeriod, setCurrentDisplayPeriod] = useState<string>(''); // For displaying the chosen period

  const { translations } = useLanguage();
  const payrollPageTranslations = translations.payrollPage;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Function to calculate payroll entries based on filtered worklogs
  const calculatePayrollEntries = (
    allWorklogs: WorkLogData[],
    employees: EmployeeResponse[],
    filterStart: string,
    filterEnd: string
  ): PayrollEntry[] => {
    const employeeMap = new Map(employees.map(emp => [emp._id, emp.name]));

    const filteredWorklogs = allWorklogs.filter(log =>
      log.status === 'Completed' && isDateInRange(log.date, filterStart, filterEnd)
    );

    const groupedWorklogs = filteredWorklogs.reduce((acc, log) => {
      if (!acc[log.employeeId]) {
        acc[log.employeeId] = {
          employeeId: log.employeeId,
          fullName: employeeMap.get(log.employeeId) || 'Unknown Employee',
          totalQuantity: 0,
          totalProductRate: 0,
          calculatedSalary: 0,
          bonusDeduction: 0, // Bonuses/deductions are applied to the total entry, not per worklog
          netSalary: 0,
          id: '', // Temporary, will be set later
          payrollPeriod: '', // Temporary, will be set later
          paidStatus: 'Unpaid', // Initialize as Unpaid
        };
      }
      acc[log.employeeId].totalQuantity += log.quantity;
      acc[log.employeeId].calculatedSalary += log.productRate * log.quantity;
      // Simple average product rate for display purposes
      acc[log.employeeId].totalProductRate = (acc[log.employeeId].calculatedSalary / acc[log.employeeId].totalQuantity) || 0;

      return acc;
    }, {} as { [key: string]: PayrollEntry });

    // Incorporate existing bonus/deduction and paid status if available (e.g., from local storage or actual backend)
    // For this mock, we'll reapply previously set bonuses/deductions and paid status to the new entries
    const existingEntryData = new Map(payrollEntries.map(entry => [entry.employeeId, { bonusDeduction: entry.bonusDeduction, paidStatus: entry.paidStatus }]));


    return Object.values(groupedWorklogs).map(entry => {
      const existingData = existingEntryData.get(entry.employeeId);
      const existingBOD = existingData?.bonusDeduction || 0;
      const existingPaidStatus = existingData?.paidStatus || 'Unpaid'; // Default to Unpaid

      return {
        ...entry,
        id: `payroll-${entry.employeeId}-${filterStart}-${filterEnd}`, // Unique ID for payroll entry based on period
        payrollPeriod: `${filterStart} - ${filterEnd}`, // Display the period used for calculation
        bonusDeduction: existingBOD, // Reapply existing bonus/deduction
        netSalary: entry.calculatedSalary + existingBOD,
        paidStatus: existingPaidStatus, // Reapply existing paid status
      };
    });
  };

  // Memoize the full list of all completed worklogs to avoid refetching
  const allCompletedWorklogs = useRef<WorkLogData[]>([]);
  const allEmployees = useRef<EmployeeResponse[]>([]); // Store all employees too

  // Initial data fetch for all employees and all completed worklogs
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const employeeData = await mockEmployeeService.getAllEmployees();
        const worklogData = await mockWorklogService.getCompletedWorklogs();
        
        allCompletedWorklogs.current = worklogData; // Store all completed worklogs
        allEmployees.current = employeeData; // Store all employees

        // Set default period to current month initially
        const today = new Date();
        const startOfMonth = getStartOfMonth(today);
        const endOfMonth = getEndOfMonth(today);

        setCustomStartDate(formatDate(startOfMonth));
        setCustomEndDate(formatDate(endOfMonth));
        setPeriodType('month'); // Explicitly set default period type
        setCurrentDisplayPeriod(
          `${payrollPageTranslations.currentPeriod} ${startOfMonth.toLocaleString('default', { month: 'long' })} ${startOfMonth.getFullYear()}`
        );

        const initialPayroll = calculatePayrollEntries(
          worklogData,
          employeeData,
          formatDate(startOfMonth),
          formatDate(endOfMonth)
        );
        setPayrollEntries(initialPayroll);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        console.error('Failed to fetch initial payroll data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []); // Run only once on component mount

  // Effect to recalculate payroll entries when period changes or apply filter button clicked (implicitly by custom date change)
  useEffect(() => {
    if (!loading && allCompletedWorklogs.current.length > 0 && allEmployees.current.length > 0) { // Ensure data is loaded
      let calculatedStartDate: string;
      let calculatedEndDate: string;
      const today = new Date(); // Use new Date() to get current date for dynamic periods

      switch (periodType) {
        case 'day':
          calculatedStartDate = formatDate(today);
          calculatedEndDate = formatDate(today);
          setCurrentDisplayPeriod(`${payrollPageTranslations.currentPeriod} ${formatDate(today)}`);
          break;
        case 'week':
          const startOfWeek = getStartOfWeek(today);
          const endOfWeek = getEndOfWeek(today);
          calculatedStartDate = formatDate(startOfWeek);
          calculatedEndDate = formatDate(endOfWeek);
          setCurrentDisplayPeriod(`${payrollPageTranslations.currentPeriod} ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);
          break;
        case 'month':
          const startOfMonth = getStartOfMonth(today);
          const endOfMonth = getEndOfMonth(today);
          calculatedStartDate = formatDate(startOfMonth);
          calculatedEndDate = formatDate(endOfMonth);
          setCurrentDisplayPeriod(`${payrollPageTranslations.currentPeriod} ${startOfMonth.toLocaleString('default', { month: 'long' })} ${startOfMonth.getFullYear()}`);
          break;
        case 'custom':
          // For custom, use the state values directly
          if (!customStartDate || !customEndDate) {
            setCurrentDisplayPeriod(payrollPageTranslations.payrollPeriodDisplay); // Or 'Invalid Period'
            setPayrollEntries([]); // Clear payroll if dates are not set for custom
            return;
          }
          calculatedStartDate = customStartDate;
          calculatedEndDate = customEndDate;
          setCurrentDisplayPeriod(`${payrollPageTranslations.currentPeriod} ${customStartDate} - ${customEndDate}`);
          break;
        default:
          // Fallback to month if periodType is somehow not set
          const defaultStartOfMonth = getStartOfMonth(today);
          const defaultEndOfMonth = getEndOfMonth(today);
          calculatedStartDate = formatDate(defaultStartOfMonth);
          calculatedEndDate = formatDate(defaultEndOfMonth);
          setCurrentDisplayPeriod(`${payrollPageTranslations.currentPeriod} ${defaultStartOfMonth.toLocaleString('default', { month: 'long' })} ${defaultStartOfMonth.getFullYear()}`);
          break;
      }
      
      const newPayrollEntries = calculatePayrollEntries(
        allCompletedWorklogs.current,
        allEmployees.current, // Use stored employees
        calculatedStartDate,
        calculatedEndDate
      );
      setPayrollEntries(newPayrollEntries);
    }
  }, [periodType, customStartDate, customEndDate, loading, payrollPageTranslations]);

  // Calculate total payroll stats
  const totalNetPayroll = payrollEntries.reduce((sum, entry) => sum + entry.netSalary, 0);
  const totalBonus = payrollEntries.reduce((sum, entry) => sum + (entry.bonusDeduction > 0 ? entry.bonusDeduction : 0), 0);
  const totalDeduction = payrollEntries.reduce((sum, entry) => sum + (entry.bonusDeduction < 0 ? Math.abs(entry.bonusDeduction) : 0), 0);

  // Filter payroll entries based on global search
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const filteredPayrollEntries = payrollEntries.filter(entry =>
    entry.fullName.toLowerCase().includes(lowerCaseSearchQuery) ||
    entry.employeeId.toLowerCase().includes(lowerCaseSearchQuery) ||
    entry.payrollPeriod.toLowerCase().includes(lowerCaseSearchQuery) ||
    String(entry.totalQuantity).includes(lowerCaseSearchQuery) ||
    String(entry.calculatedSalary).includes(lowerCaseSearchQuery) ||
    String(entry.netSalary).includes(lowerCaseSearchQuery) ||
    (entry.bonusDeduction !== 0 && String(Math.abs(entry.bonusDeduction)).includes(lowerCaseSearchQuery)) ||
    entry.paidStatus.toLowerCase().includes(lowerCaseSearchQuery) // NEW: Include paidStatus in search
  );

  const totalEntries = filteredPayrollEntries.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayrollEntries = filteredPayrollEntries.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset page when search query or period changes
  }, [searchQuery, periodType, customStartDate, customEndDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenBonusDeductionModal = (entry: PayrollEntry) => {
    setSelectedPayrollEntry(entry);
    setIsBonusDeductionModalOpen(true);
  };

  const handleSaveBonusDeduction = (id: string, newBonusDeduction: number, note: string) => {
    setPayrollEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id) {
          const updatedEntry = {
            ...entry,
            bonusDeduction: newBonusDeduction,
            netSalary: entry.calculatedSalary + newBonusDeduction,
          };
          return updatedEntry;
        }
        return entry;
      })
    );
    console.log(`[UI-ONLY] Updated bonus/deduction for ${id}: ${newBonusDeduction}, Note: ${note}`);
  };

  // NEW: Handler for changing paid status
  const handlePaidStatusChange = (id: string, newStatus: 'Paid' | 'Unpaid') => {
    setPayrollEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, paidStatus: newStatus } : entry
      )
    );
    console.log(`[UI-ONLY] Updated paid status for ${id} to: ${newStatus}`);
  };


  if (loading) return <div className="text-center py-8">{translations.common.loading}...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{translations.common.error}: {error}</div>;

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center md:justify-evenly gap-4 md:gap-6 shadow-sm">
          {/* Stat Item 1: Total Net Payroll */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calculator className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{payrollPageTranslations.totalNetPayroll}</p>
              <p className="text-3xl font-bold mt-1">Ks. {totalNetPayroll.toLocaleString()}</p>
            </div>
          </div>

          {/* Stat Item 2: Total Bonus */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Plus className="text-green-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{payrollPageTranslations.totalBonus}</p>
              <p className="text-3xl font-bold mt-1">Ks. {totalBonus.toLocaleString()}</p>
            </div>
          </div>

          {/* Stat Item 3: Total Deduction */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Minus className="text-blue-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{payrollPageTranslations.totalDeduction}</p>
              <p className="text-3xl font-bold mt-1">Ks. {totalDeduction.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table Header/Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">{payrollPageTranslations.allPayrollTitle}</h2>
              <p className="text-sm text-gray-500">
                {currentDisplayPeriod}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Period Type Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={periodType}
                  onChange={(e) => {
                    setPeriodType(e.target.value as 'month' | 'week' | 'day' | 'custom');
                    // Reset custom dates if switching away from custom
                    if (e.target.value !== 'custom') {
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="month">{payrollPageTranslations.periodTypeMonth}</option>
                  <option value="week">{payrollPageTranslations.periodTypeWeek}</option>
                  <option value="day">{payrollPageTranslations.periodTypeDay}</option>
                  <option value="custom">{payrollPageTranslations.periodTypeCustom}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Conditional Custom Date Inputs */}
              {periodType === 'custom' && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                  <label htmlFor="startDate" className="sr-only">{payrollPageTranslations.startDateLabel}</label>
                  <input
                    type="date"
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <label htmlFor="endDate" className="sr-only">{payrollPageTranslations.endDateLabel}</label>
                  <input
                    type="date"
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              )}

              <button
                onClick={() => alert("Export functionality not implemented.")} // Placeholder for export
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#4CAF50] text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full sm:w-auto"
              >
                <FileText className="w-4 h-4" />
                {payrollPageTranslations.exportButton}
              </button>
              {/* Original Sort by Date - This is usually for column sorting, not period selection */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer w-full sm:w-auto">
                <span className="font-medium text-gray-700">{payrollPageTranslations.sortBy}</span>
                <span className="font-semibold text-gray-900">{payrollPageTranslations.fullNameColumn}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.fullNameColumn}</th>
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.productRateColumn}</th>
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.totalQuantityColumn}</th>
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.totalSalaryColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{payrollPageTranslations.bonusDeductionColumn}</th>
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.netSalaryColumn}</th>
                  <th className="py-3 px-4 font-semibold">{payrollPageTranslations.paidStatusColumn}</th> {/* NEW COLUMN */}
                </tr>
              </thead>
              <tbody>
                {currentPayrollEntries.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{entry.fullName}</td>
                    <td className="py-3 px-4 text-gray-700">{entry.totalProductRate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700">{entry.totalQuantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">Ks. {entry.calculatedSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenBonusDeductionModal(entry)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${entry.bonusDeduction > 0 ? 'bg-green-100 text-green-800' :
                            entry.bonusDeduction < 0 ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-600'}
                          hover:opacity-80 transition-opacity flex items-center justify-center mx-auto
                        `}
                      >
                        {entry.bonusDeduction > 0 ? `+ ${entry.bonusDeduction.toLocaleString()} Ks` :
                         entry.bonusDeduction < 0 ? `- ${Math.abs(entry.bonusDeduction).toLocaleString()} Ks` :
                         payrollPageTranslations.none}
                        <Edit size={14} className="ml-1" />
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">Ks. {entry.netSalary.toLocaleString()}</td>
                    {/* NEW: Paid Status Dropdown */}
                    <td className="py-3 px-4 text-left">
                      <div className="relative">
                        <select
                          value={entry.paidStatus}
                          onChange={(e) => handlePaidStatusChange(entry.id, e.target.value as 'Paid' | 'Unpaid')}
                          className={`
                            w-full px-2 py-1 border rounded-full text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-red-300 pr-6
                            ${entry.paidStatus === 'Paid' ? 'bg-green-100 text-green-800 border-green-300' :
                              'bg-yellow-100 text-yellow-800 border-yellow-300'}
                          `}
                        >
                          <option value="Unpaid">{payrollPageTranslations.statusUnpaid}</option>
                          <option value="Paid">{payrollPageTranslations.statusPaid}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              {payrollPageTranslations.showing} {startIndex + 1} {payrollPageTranslations.of} {Math.min(endIndex, totalEntries)} {payrollPageTranslations.of} {totalEntries} {payrollPageTranslations.payrollEntries}
            </p>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                    page === currentPage ? 'bg-[#EB5757] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus/Deduction Modal */}
      <BonusDeductionModal
        isOpen={isBonusDeductionModalOpen}
        onClose={() => setIsBonusDeductionModalOpen(false)}
        payrollEntry={selectedPayrollEntry}
        onSave={handleSaveBonusDeduction}
      />
    </div>
  );
};

export default Payroll;
// Mock services for worklog and employee data