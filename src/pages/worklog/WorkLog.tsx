// src/pages/WorkLog.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Users, ClipboardList, DollarSign, Plus, ChevronDown, Edit, Trash2, X, ChevronLeft, ChevronRight, Box } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext'; // Adjust path as necessary
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams for global search

// --- DTOs ---
// Employee Response DTO (if coming from a backend)
export interface EmployeeResponse {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  position: string;
  joinedDate: string;
}

// Employee DTO for creating/updating (typically without _id)
export interface EmployeeDto {
  name: string;
  phoneNumber: string;
  address: string;
  position: string;
  joinedDate: string;
}

// --- Mock Employee Service (for demonstration purposes) ---
// In a real application, this would be a separate service file making API calls.
const mockEmployees: EmployeeResponse[] = [
  {
    _id: '6674e2d3122c6c31f4e0c4b2',
    name: 'Kyaw',
    phoneNumber: '09123456789',
    address: 'Yangon',
    position: 'Plastic Producer',
    joinedDate: '2023-01-15'
  },
  {
    _id: '6674e2d3122c6c31f4e0c4b3',
    name: 'Aung Aung',
    phoneNumber: '09876543210',
    address: 'Mandalay',
    position: 'Packaging',
    joinedDate: '2022-11-01'
  },
  {
    _id: '6674e2d3122c6c31f4e0c4b4',
    name: 'Su Su',
    phoneNumber: '09112233445',
    address: 'Naypyidaw',
    position: 'Quality Control',
    joinedDate: '2024-03-20'
  },
  {
    _id: '6674e2d3122c6c31f4e0c4b5',
    name: 'Mya Mya',
    phoneNumber: '09556677889',
    address: 'Taunggyi',
    position: 'Bottle Producer',
    joinedDate: '2023-09-10'
  },
];

const mockEmployeeService = {
  getAllEmployees: async (): Promise<EmployeeResponse[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockEmployees);
      }, 500); // Simulate network delay
    });
  }
};


// -------------------------------------------------------------------------
// WorkLog Data Interface (CHANGED: Replaced salary with status)
// -------------------------------------------------------------------------
interface WorkLogData {
  _id: string;
  employeeId: string;
  fullName: string;
  productRate: number;
  quantity: number;
  role: string;
  date: string;
  status: 'On Going' | 'Completed' | 'Rejected'; // NEW: Status field
  note: string;
}

// --- Helper function to get today's date in YYYY-MM-DD format ---
const getTodaysDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initial Mock Data (CHANGED: Updated to include status)
const initialWorkLogData: WorkLogData[] = [
  {
    _id: 'wl-001',
    employeeId: '6674e2d3122c6c31f4e0c4b2', // Kyaw
    fullName: 'Kyaw',
    productRate: 2.5,
    quantity: 1000,
    role: 'Plastic Producer',
    date: '2025-04-29',
    status: 'Completed',
    note: '20 quantity errored.'
  },
  {
    _id: 'wl-002',
    employeeId: '6674e2d3122c6c31f4e0c4b2', // Kyaw
    fullName: 'Kyaw',
    productRate: 4,
    quantity: 500,
    role: 'Bottle Producer',
    date: '2025-05-01',
    status: 'On Going',
    note: ''
  },
  {
    _id: 'wl-003',
    employeeId: '6674e2d3122c6c31f4e0c4b2', // Kyaw
    fullName: 'Kyaw',
    productRate: 4,
    quantity: 120,
    role: 'Bottle Producer',
    date: '2025-05-02',
    status: 'Rejected',
    note: 'Deducted 2000Ks from total due to quality.'
  },
  {
    _id: 'wl-004',
    employeeId: '6674e2d3122c6c31f4e0c4b3', // Aung Aung
    fullName: 'Aung Aung',
    productRate: 3,
    quantity: 800,
    role: 'Packaging',
    date: '2025-05-03',
    status: 'Completed',
    note: ''
  },
  {
    _id: 'wl-005',
    employeeId: '6674e2d3122c6c31f4e0c4b4', // Su Su
    fullName: 'Su Su',
    productRate: 5,
    quantity: 300,
    role: 'Quality Control',
    date: '2025-05-04',
    status: 'On Going',
    note: 'Bonus included'
  },
];


// -------------------------------------------------------------------------
// AddWorkLogModal Component
// -------------------------------------------------------------------------
interface AddWorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  workLogToEdit?: WorkLogData;
  onSave: (workLog: WorkLogData, isEditing: boolean) => void;
  employees: EmployeeResponse[];
}

const AddWorkLogModal = ({ isOpen, onClose, workLogToEdit, onSave, employees }: AddWorkLogModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.workLogPage;

  const isEditing = !!workLogToEdit;

  // State for form inputs
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState(getTodaysDate());
  const [status, setStatus] = useState<'On Going' | 'Completed' | 'Rejected'>('On Going');
  const [note, setNote] = useState('');

  // Effect to set initial form values when modal opens or workLogToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (workLogToEdit) {
        setSelectedEmployeeId(workLogToEdit.employeeId);
        setFullName(workLogToEdit.fullName);
        setProductRate(workLogToEdit.productRate.toString());
        setQuantity(workLogToEdit.quantity.toString());
        setRole(workLogToEdit.role);
        setDate(workLogToEdit.date);
        setStatus(workLogToEdit.status);
        setNote(workLogToEdit.note);
      } else {
        setSelectedEmployeeId(employees.length > 0 ? employees[0]._id : '');
        setFullName(employees.length > 0 ? employees[0].name : '');
        setProductRate('');
        setQuantity('');
        setRole(employees.length > 0 ? employees[0].position : '');
        setDate(getTodaysDate());
        setStatus('On Going');
        setNote('');
      }
    }
  }, [isOpen, workLogToEdit, employees]);

  // Handle employee selection from dropdown
  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const employee = employees.find(emp => emp._id === selectedId);
    setSelectedEmployeeId(selectedId);
    setFullName(employee ? employee.name : '');
    setRole(employee ? employee.position : '');
  };

  // Close modal on outside click
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployeeId || !fullName) {
      alert("Please select an employee.");
      return;
    }

    const id = isEditing ? workLogToEdit!._id : `temp-${Date.now()}`;

    const submittedWorkLogData: WorkLogData = {
      _id: id,
      employeeId: selectedEmployeeId,
      fullName: fullName,
      productRate: parseFloat(productRate),
      quantity: parseInt(quantity),
      role: role,
      date: date,
      status: status,
      note: note,
    };

    console.log(`[UI-ONLY] ${isEditing ? 'Editing' : 'Adding'} Work Log. Data captured for backend:`, submittedWorkLogData);
    onSave(submittedWorkLogData, isEditing);
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
          {isEditing ? modalTranslations.editWorkLogTitle : modalTranslations.addNewWorkLogTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.fullNameColumn}</label>
            <div className="relative">
              <select
                id="employeeName"
                value={selectedEmployeeId}
                onChange={handleEmployeeSelect}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
                required
              >
                <option value="" disabled>{modalTranslations.selectEmployee}</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.position})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="productRate" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.productRateColumn}</label>
            <input
              type="number"
              id="productRate"
              placeholder="e.g., 2.5"
              value={productRate}
              onChange={(e) => setProductRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.quantityColumn}</label>
            <input
              type="number"
              id="quantity"
              placeholder="e.g., 1000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.roleColumn}</label>
            <input
              type="text"
              id="role"
              placeholder="e.g., Plastic producer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.dateColumn}</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.statusColumn}</label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'On Going' | 'Completed' | 'Rejected')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
                required
              >
                <option value="On Going">{modalTranslations.statusOnGoing}</option>
                <option value="Completed">{modalTranslations.statusCompleted}</option>
                <option value="Rejected">{modalTranslations.statusRejected}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.noteColumn} ({modalTranslations.optional})</label>
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
              {isEditing ? modalTranslations.saveChangesButton : modalTranslations.addWorkLogButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// ConfirmDeleteModal Component (unchanged)
// -------------------------------------------------------------------------
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  workLogId: string | null;
  workLogName: string;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, workLogId, workLogName }: ConfirmDeleteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.workLogPage;

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <Trash2 className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {modalTranslations.confirmDeleteTitle}
        </h2>
        <p className="text-gray-600 mb-6">
          {modalTranslations.confirmDeleteMessage1} <span className="font-semibold text-red-600">{workLogName}</span>{modalTranslations.confirmDeleteMessage2}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            {modalTranslations.cancelButton}
          </button>
          <button
            onClick={() => {
              if (workLogId) {
                console.log(`[UI-ONLY] Confirming deletion of work log ID: ${workLogId} (Name: ${workLogName})`);
                onConfirm(workLogId);
              }
              onClose();
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            {modalTranslations.deleteButton}
          </button>
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------------------
// WorkLog Component (Main Page - UI - ADDED STATUS FILTER DROPDOWN)
// -------------------------------------------------------------------------
interface WorkLogProps {
  currentPath?: string;
}

const WorkLog = ({ currentPath }: WorkLogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [workLogToDeleteDetails, setWorkLogToDeleteDetails] = useState<{ id: string, name: string } | null>(null);
  const [selectedWorkLogForEdit, setSelectedWorkLogForEdit] = useState<WorkLogData | undefined>(undefined);

  const [workLogs, setWorkLogs] = useState<WorkLogData[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: State for status filter dropdown
  const [filterStatus, setFilterStatus] = useState<'' | 'On Going' | 'Completed' | 'Rejected'>(''); // '' for "All"

  const { translations } = useLanguage();
  const workLogPageTranslations = translations.workLogPage;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Fetch employees on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const employeeData = await mockEmployeeService.getAllEmployees();
        setEmployees(employeeData);

        const updatedWorkLogs = initialWorkLogData.map(log => {
          const employee = employeeData.find(emp => emp._id === log.employeeId);
          return {
            ...log,
            fullName: employee ? employee.name : log.fullName
          };
        });
        setWorkLogs(updatedWorkLogs);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        console.error('Failed to fetch employees or work logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter work logs based on both global search and the new status filter
  const filteredWorkLogs = workLogs.filter(log => {
    const matchesSearchQuery =
      log.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.date.includes(searchQuery) ||
      log.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusFilter =
      filterStatus === '' || log.status === filterStatus;

    return matchesSearchQuery && matchesStatusFilter;
  });

  const totalWorkLogs = filteredWorkLogs.length;
  const totalCompletedWorklogs = filteredWorkLogs.filter(log => log.status === 'Completed').length;
  const totalQuantityProduced = filteredWorkLogs.reduce((sum, log) => sum + log.quantity, 0);

  const totalPages = Math.ceil(totalWorkLogs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkLogs = filteredWorkLogs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset page when search query or filter status changes
  }, [searchQuery, filterStatus]); // Added filterStatus to dependencies

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenAddModal = () => {
    setSelectedWorkLogForEdit(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (workLog: WorkLogData) => {
    setSelectedWorkLogForEdit(workLog);
    setIsAddModalOpen(true);
  };

  const handleSaveWorkLog = (workLog: WorkLogData, isEditing: boolean) => {
    if (isEditing) {
      setWorkLogs(prevLogs => prevLogs.map(log => log._id === workLog._id ? workLog : log));
    } else {
      setWorkLogs(prevLogs => [...prevLogs, { ...workLog, _id: `wl-${Date.now()}` }]);
    }
    console.log(`[UI-ONLY] ${isEditing ? 'Saved' : 'Added'} Work Log data (would send to backend):`, workLog);
  };

  const handleConfirmDeleteClick = (workLog: WorkLogData) => {
    setWorkLogToDeleteDetails({ id: workLog._id, name: workLog.fullName });
    setIsDeleteConfirmModalOpen(true);
  };

  const handleExecuteDelete = (id: string) => {
    setWorkLogs(prevLogs => prevLogs.filter(log => log._id !== id));
    console.log(`[UI-ONLY] Executed deletion for work log ID: ${id} (would call backend delete API)`);
  };

  if (loading) return <div className="text-center py-8">{translations.common.loading}...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{translations.common.error}: {error}</div>;


  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center md:justify-evenly gap-4 md:gap-6 shadow-sm">
          {/* Stat Item 1: Total Work Logs */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardList className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{workLogPageTranslations.totalWorkLogs}</p>
              <p className="text-3xl font-bold mt-1">{totalWorkLogs}</p>
            </div>
          </div>

          {/* Stat Item 2: Total Completed Worklogs */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardList className="text-green-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{workLogPageTranslations.totalCompletedWorklogs}</p>
              <p className="text-3xl font-bold mt-1">{totalCompletedWorklogs}</p>
            </div>
          </div>

          {/* Stat Item 3: Total Quantity Produced */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Box className="text-blue-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{workLogPageTranslations.totalQuantityProduced}</p>
              <p className="text-3xl font-bold mt-1">{totalQuantityProduced.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table Header/Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">{workLogPageTranslations.workLogsTitle}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* NEW: Status Filter Dropdown (main filter) */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as '' | 'On Going' | 'Completed' | 'Rejected')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="">{workLogPageTranslations.statusColumn}</option>
                  <option value="On Going">{workLogPageTranslations.statusOnGoing}</option>
                  <option value="Completed">{workLogPageTranslations.statusCompleted}</option>
                  <option value="Rejected">{workLogPageTranslations.statusRejected}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              {/* Existing Sort by Date */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer w-full sm:w-auto">
                <span className="font-medium text-gray-700">{workLogPageTranslations.sortBy}</span>
                <span className="font-semibold text-gray-900">{workLogPageTranslations.date}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#EB5757] text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                {workLogPageTranslations.addNewWorkLog}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.fullNameColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.employeeIdColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.dateColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.productRateColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.quantityColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.roleColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.statusColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.noteColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{workLogPageTranslations.actionColumn}</th>
                </tr>
              </thead>
              <tbody>
                {currentWorkLogs.map(log => (
                  <tr key={log._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{log.fullName}</td>
                    <td className="py-3 px-4 text-gray-700">{log.employeeId}</td>
                    <td className="py-3 px-4 text-gray-700">{log.date}</td>
                    <td className="py-3 px-4 text-gray-700">{log.productRate}</td>
                    <td className="py-3 px-4 text-gray-700">{log.quantity}</td>
                    <td className="py-3 px-4 text-gray-700">{log.role}</td>
                    {/* NEW: Dropdown for Status in each table row */}
                    <td className="py-3 px-4 text-left">
                      <div className="relative">
                        <select
                          value={log.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as 'On Going' | 'Completed' | 'Rejected';
                            handleSaveWorkLog({ ...log, status: newStatus }, true); // Update the status of this specific log
                          }}
                          className={`
                            w-full px-2 py-1 border border-gray-300 rounded-full text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-red-300 pr-6
                            ${log.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-300' :
                              log.status === 'On Going' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              'bg-red-100 text-red-800 border-red-300'}
                          `}
                        >
                          <option value="On Going">{workLogPageTranslations.statusOnGoing}</option>
                          <option value="Completed">{workLogPageTranslations.statusCompleted}</option>
                          <option value="Rejected">{workLogPageTranslations.statusRejected}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{log.note}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(log)}
                          className="text-[#007BFF] hover:text-[#0056b3] font-medium p-1 rounded-full hover:bg-gray-100"
                          title={workLogPageTranslations.editButton}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleConfirmDeleteClick(log)}
                          className="text-red-500 hover:text-red-700 font-medium p-1 rounded-full hover:bg-gray-100"
                          title={workLogPageTranslations.deleteButton}
                        >
                          <Trash2 size={18} />
                        </button>
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
              {workLogPageTranslations.showing} {startIndex + 1} {workLogPageTranslations.of} {Math.min(endIndex, totalWorkLogs)} {workLogPageTranslations.of} {totalWorkLogs} {workLogPageTranslations.workLogs}
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

      {/* Add/Edit Work Log Modal */}
      <AddWorkLogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        workLogToEdit={selectedWorkLogForEdit}
        onSave={handleSaveWorkLog}
        employees={employees}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleExecuteDelete}
        workLogId={workLogToDeleteDetails?.id || null}
        workLogName={workLogToDeleteDetails?.name || 'this work log entry'}
      />
    </div>
  );
};

export default WorkLog;
