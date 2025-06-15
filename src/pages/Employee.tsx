import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, ChevronLeft, ChevronRight, ChevronDown, Check, X, Edit, Trash2 } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

// -------------------------------------------------------------------------
// EmployeeData Interface
// -------------------------------------------------------------------------
interface EmployeeData {
  id: string; // Unique ID for table keys and identifying which employee is being "edited" or "deleted"
  name: string;
  employeeId: string;
  phone: string;
  role: string;
  joinDate: string; // YYYY-MM-DD format
  status: 'Active' | 'On leave';
  baseRate: string;
}

// -------------------------------------------------------------------------
// AddEmployeeModal Component (UI-focused, logs data on submit)
// -------------------------------------------------------------------------
interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: EmployeeData; // Optional: if provided, it's an "edit" operation
  onSave: (employee: EmployeeData, isEditing: boolean) => void;
}

const AddEmployeeModal = ({ isOpen, onClose, employeeToEdit, onSave }: AddEmployeeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.employeePage;

  const isEditing = !!employeeToEdit;

  // State for form inputs, initialized from employeeToEdit if editing
  const [fullName, setFullName] = useState(employeeToEdit?.name || '');
  const [baseRate, setBaseRate] = useState(employeeToEdit?.baseRate || '');
  const [phoneNumber, setPhoneNumber] = useState(employeeToEdit?.phone || '');
  const [role, setRole] = useState(employeeToEdit?.role || '');
  const [joinDate, setJoinDate] = useState(employeeToEdit?.joinDate || '');
  const [status, setStatus] = useState<'Active' | 'On leave'>(employeeToEdit?.status || 'Active');

  // Reset form fields when modal opens or employeeToEdit changes
  useEffect(() => {
    if (isOpen) {
      setFullName(employeeToEdit?.name || '');
      setBaseRate(employeeToEdit?.baseRate || '');
      setPhoneNumber(employeeToEdit?.phone || '');
      setRole(employeeToEdit?.role || '');
      setJoinDate(employeeToEdit?.joinDate || '');
      setStatus(employeeToEdit?.status || 'Active');
    }
  }, [isOpen, employeeToEdit]);

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

    const employeeId = isEditing ? employeeToEdit!.employeeId : `E-${Date.now().toString().slice(-4)}`;
    const id = isEditing ? employeeToEdit!.id : `temp-${Date.now()}`;

    const submittedEmployeeData: EmployeeData = {
      id,
      employeeId,
      name: fullName,
      baseRate,
      phone: phoneNumber,
      role,
      joinDate,
      status,
    };

    console.log(`[UI-ONLY] ${isEditing ? 'Editing' : 'Adding'} Employee. Data captured for backend:`, submittedEmployeeData);
    onSave(submittedEmployeeData, isEditing);
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
          {isEditing ? modalTranslations.editEmployeeTitle : modalTranslations.addNewEmployeeTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={modalTranslations.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={modalTranslations.baseRatePlaceholder}
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
            <input
              type="text"
              placeholder={modalTranslations.phoneNumberPlaceholder}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder={modalTranslations.rolePlaceholder}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <input
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>

          <div>
            <p className="text-gray-700 mb-2">{modalTranslations.selectTypeLabel}</p>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="form-radio text-red-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">{modalTranslations.activeStatus}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="On leave"
                  checked={status === 'On leave'}
                  onChange={() => setStatus('On leave')}
                  className="form-radio text-red-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">{modalTranslations.onLeaveStatus}</span>
              </label>
            </div>
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
              {isEditing ? modalTranslations.saveChangesButton : modalTranslations.addButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// -------------------------------------------------------------------------
// ConfirmDeleteModal Component (UI-focused, logs action on confirm)
// -------------------------------------------------------------------------
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  employeeId: string | null;
  employeeName: string;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, employeeId, employeeName }: ConfirmDeleteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.employeePage;

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
          {modalTranslations.confirmDeleteMessage1} <span className="font-semibold text-red-600">{employeeName}</span> {modalTranslations.confirmDeleteMessage2}
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
              if (employeeId) {
                console.log(`[UI-ONLY] Confirming deletion of employee ID: ${employeeId} (Name: ${employeeName})`);
                onConfirm(employeeId);
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
// StatusChanger Component (New for inline status change UI)
// -------------------------------------------------------------------------
interface EmployeePageTranslations {
  active: string;
  onLeave: string;
  activeStatus: string;
  onLeaveStatus: string;
  // Add any other translation keys used in StatusChanger if needed
}

interface StatusChangerProps {
  employeeId: string;
  employeeName: string;
  currentStatus: 'Active' | 'On leave';
  translations: EmployeePageTranslations;
}

const StatusChanger: React.FC<StatusChangerProps> = ({ employeeId, employeeName, currentStatus, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getBadgeStyle = (status: 'Active' | 'On leave') => {
    return status === 'Active' ? {
      bg: 'bg-[#E6FAF7]',
      text: 'text-[#00B09A]'
    } : {
      bg: 'bg-[#FFF2F2]',
      text: 'text-[#EB5757]'
    };
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: 'Active' | 'On leave') => {
    console.log(`[UI-ONLY] Attempting to change status for Employee ID: ${employeeId} (${employeeName}) from "${currentStatus}" to "${newStatus}". (This change is not persistent as data is static)`);
    setIsOpen(false); // Close dropdown after selection
    // In a real app, you would send an API call here to update the status in the backend.
    // The parent component would then re-fetch or update its state to reflect the change.
  };

  const currentBadgeStyle = getBadgeStyle(currentStatus);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${currentBadgeStyle.bg} ${currentBadgeStyle.text} hover:opacity-80 transition-opacity`}
      >
        <span>{currentStatus === 'Active' ? translations.active : translations.onLeave}</span>
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleStatusChange('Active')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {translations.activeStatus}
            </button>
            <button
              onClick={() => handleStatusChange('On leave')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {translations.onLeaveStatus}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// -------------------------------------------------------------------------
// Employee Component (Main Page - UI-focused)
// -------------------------------------------------------------------------
interface EmployeeProps {
  currentPath?: string;
  searchQuery?: string;
}

const Employee = ({ currentPath, searchQuery = "" }: EmployeeProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteDetails, setEmployeeToDeleteDetails] = useState<{ id: string, name: string } | null>(null);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<EmployeeData | undefined>(undefined);

  const { language, translations } = useLanguage();
  const employeePageTranslations = translations.employeePage;

  // This is now a CONST array. Changes here won't be reflected in UI
  const allEmployees: EmployeeData[] = [
    { id: '1', name: 'Kyaw', employeeId: 'E-01', phone: '09-5120045', role: 'Plastic producer', joinDate: '2020-04-29', status: 'Active', baseRate: '25000' },
    { id: '2', name: 'Soe', employeeId: 'E-02', phone: '09-1234564', role: 'Plastic checker', joinDate: '2020-05-20', status: 'On leave', baseRate: '22000' },
    { id: '3', name: 'Thant', employeeId: 'E-11', phone: '09-1234565', role: 'Plastic checker', joinDate: '2020-05-21', status: 'Active', baseRate: '22500' },
    { id: '4', name: 'Thin', employeeId: 'E-12', phone: '09-1246634', role: 'Plastic checker', joinDate: '2020-05-25', status: 'Active', baseRate: '23000' },
    { id: '5', name: 'Htet', employeeId: 'E-14', phone: '09-57341162', role: 'Plastic checker', joinDate: '2020-05-27', status: 'Active', baseRate: '21000' },
    { id: '6', name: 'Aung', employeeId: 'E-04', phone: '09-34571234', role: 'Plastic Producer', joinDate: '2020-07-21', status: 'Active', baseRate: '26000' },
    { id: '7', name: 'Yein', employeeId: 'E-05', phone: '09-41431556', role: 'N/A', joinDate: '2020-08-21', status: 'Active', baseRate: '20000' },
    { id: '8', name: 'Myo', employeeId: 'E-06', phone: '09-12345678', role: 'Quality Control', joinDate: '2020-09-15', status: 'Active', baseRate: '24000' },
    { id: '9', name: 'Zaw', employeeId: 'E-07', phone: '09-87654321', role: 'Machine Operator', joinDate: '2020-10-01', status: 'On leave', baseRate: '23500' },
    { id: '10', name: 'Htoo', employeeId: 'E-08', phone: '09-11223344', role: 'Supervisor', joinDate: '2020-10-15', status: 'Active', baseRate: '30000' },
    { id: '11', name: 'Naing', employeeId: 'E-09', phone: '09-55443322', role: 'Technician', joinDate: '2020-11-01', status: 'Active', baseRate: '27000' },
    { id: '12', name: 'Thura', employeeId: 'E-10', phone: '09-99887766', role: 'Assistant', joinDate: '2020-11-15', status: 'On leave', baseRate: '19000' },
    { id: '13', name: 'Kaung', employeeId: 'E-13', phone: '09-66554433', role: 'Operator', joinDate: '2020-12-01', status: 'Active', baseRate: '21500' },
    { id: '14', name: 'Phyo', employeeId: 'E-15', phone: '09-33221144', role: 'Helper', joinDate: '2020-12-15', status: 'On leave', baseRate: '18000' },
  ];


  const filteredEmployees = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery)
  );

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = filteredEmployees.filter(emp => emp.status === 'On leave').length;

  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // getStatusBadge is no longer needed directly; StatusChanger handles its own styling
  // const getStatusBadge = (status: string) => { /* ... */ };

  const handleOpenAddModal = () => {
    setSelectedEmployeeForEdit(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (employee: EmployeeData) => {
    setSelectedEmployeeForEdit(employee);
    setIsAddModalOpen(true);
  };

  // Dummy function for saving/updating - just logs data
  const handleSaveEmployee = (employee: EmployeeData, isEditing: boolean) => {
    console.log(`[UI-ONLY] ${isEditing ? 'Saved' : 'Added'} Employee data (would send to backend):`, employee);
  };

  const handleConfirmDeleteClick = (employee: EmployeeData) => {
    setEmployeeToDeleteDetails({ id: employee.id, name: employee.name });
    setIsDeleteConfirmModalOpen(true);
  };

  // Dummy function for actual deletion - just logs the ID
  const handleExecuteDelete = (id: string) => {
    console.log(`[UI-ONLY] Executed deletion for employee ID: ${id} (would call backend delete API)`);
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-around gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.totalEmployee}</p>
              <p className="text-3xl font-bold mt-1">{totalEmployees}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="text-green-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.active}</p>
              <p className="text-3xl font-bold mt-1">{activeEmployees}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <X className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.onLeave}</p>
              <p className="text-3xl font-bold mt-1">{onLeaveEmployees}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">{employeePageTranslations.allEmployees}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer">
                <span className="font-medium text-gray-700">{employeePageTranslations.sortBy}</span>
                <span className="font-semibold text-gray-900">{employeePageTranslations.joinDate}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-5 py-2 bg-[#EB5757] text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {employeePageTranslations.addNewEmployee}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.fullNameColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.employeeIdColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.phoneNumberColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.roleColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.joinDateColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.statusColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.actionColumn}</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.employeeId}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.phone}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.role}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.joinDate}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusChanger
                        employeeId={emp.id}
                        employeeName={emp.name}
                        currentStatus={emp.status}
                        translations={employeePageTranslations}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="text-[#007BFF] hover:text-[#0056b3] font-medium p-1 rounded-full hover:bg-gray-100"
                          title={String(employeePageTranslations.editButton)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleConfirmDeleteClick(emp)}
                          className="text-red-500 hover:text-red-700 font-medium p-1 rounded-full hover:bg-gray-100"
                          title={String(employeePageTranslations.deleteButton)}
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
              {employeePageTranslations.showing} {startIndex + 1} {employeePageTranslations.of} {Math.min(endIndex, totalEmployees)} {employeePageTranslations.of} {totalEmployees} {employeePageTranslations.employees}
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

      {/* Add/Edit Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        employeeToEdit={selectedEmployeeForEdit}
        onSave={handleSaveEmployee}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleExecuteDelete}
        employeeId={employeeToDeleteDetails?.id || null}
        employeeName={employeeToDeleteDetails?.name || 'this employee'}
      />
    </div>
  );
};

export default Employee;