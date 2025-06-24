import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, ChevronLeft, ChevronRight, ChevronDown, Check, X, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { employeeService } from '@/services/employeeService';
import { AddEmployeeModal } from '@/components/AddEmployeeModal/AddEmployeeModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { EmployeeDto } from '@/dtos/employee/EmployeeDto';


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
  currentStatus: 'active' | 'on_leave';
  translations: EmployeePageTranslations;
}

const StatusChanger: React.FC<StatusChangerProps> = ({ employeeId, employeeName, currentStatus, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getBadgeStyle = (status: 'active' | 'on_leave') => {
    return status === 'active' ? {
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

  const handleStatusChange = (newStatus: 'active' | 'on_leave') => {
    employeeService.updateEmployee(employeeId, newStatus)
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
        <span>{currentStatus === 'active' ? translations.active : translations.onLeave}</span>
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleStatusChange('active')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {translations.activeStatus}
            </button>
            <button
              onClick={() => handleStatusChange('on_leave')}
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
// Employee Component (Main Page - UI)
// -------------------------------------------------------------------------
interface EmployeeProps {
  currentPath?: string;
  searchQuery?: string;
}

const Employee = ({ currentPath, searchQuery = "" }: EmployeeProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteDetails, setEmployeeToDeleteDetails] = useState<{ id: string, name: string } | null>(null);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<EmployeeResponse | undefined>(undefined);

  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { language, translations } = useLanguage();
  const employeePageTranslations = translations.employeePage;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching employees');
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phoneNumber.includes(searchQuery)
  );

  // need to change later : Bro Thu Yein
  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(emp => emp.position === 'active').length;
  const onLeaveEmployees = filteredEmployees.filter(emp => emp.position === 'on_leave').length;

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

  const handleOpenAddModal = () => {
    setSelectedEmployeeForEdit(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (employee: EmployeeResponse) => {
    setSelectedEmployeeForEdit(employee);
    setIsAddModalOpen(true);
  };

  // Todo: Need to change model 
  const handleSaveEmployee = (employee: EmployeeDto) => {
    console.log(`[UI-ONLY] Saved/Added Employee data (would send to backend):`, employee);
  };

  const handleConfirmDeleteClick = (employee: EmployeeResponse) => {
    setEmployeeToDeleteDetails({ id: employee._id, name: employee.name });
    setIsDeleteConfirmModalOpen(true);
  };

  const handleExecuteDelete = (id: string) => {
    console.log(`[UI-ONLY] Executed deletion for employee ID: ${id} (would call backend delete API)`);
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center md:justify-evenly gap-4 md:gap-6 shadow-sm">
          {/* Stat Item 1: Total Employees */}
          {/* Added w-full for explicit full width on mobile */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="text-red-500 w-7 h-7" />
            </div>
            {/* Removed 'text-center' from this div for better mobile readability */}
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.totalEmployee}</p>
              <p className="text-3xl font-bold mt-1">{totalEmployees}</p>
            </div>
          </div>

          {/* Stat Item 2: Active Employees */}
          {/* Added w-full for explicit full width on mobile */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="text-green-500 w-7 h-7" />
            </div>
            {/* Removed 'text-center' from this div for better mobile readability */}
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.active}</p>
              <p className="text-3xl font-bold mt-1">{activeEmployees}</p>
            </div>
          </div>

          {/* Stat Item 3: On Leave Employees */}
          {/* Added w-full for explicit full width on mobile */}
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="text-red-500 w-7 h-7" />
            </div>
            {/* Removed 'text-center' from this div for better mobile readability */}
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.onLeave}</p>
              <p className="text-3xl font-bold mt-1">{onLeaveEmployees}</p>
            </div>
          </div>
        </div>

        {/* Table Header/Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* This div now controls responsive layout for title and actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            {/* All Employees Title */}
            <div>
              <h2 className="text-xl font-bold">{employeePageTranslations.employees}</h2>
            </div>
            {/* Sort by and Add New Employee - wrapped for mobile stacking */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"> {/* Changed to flex-col on mobile, flex-row on small+ */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer w-full sm:w-auto"> {/* Added w-full for mobile */}
                <span className="font-medium text-gray-700">{employeePageTranslations.sortBy}</span>
                <span className="font-semibold text-gray-900">{employeePageTranslations.joinDate}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#EB5757] text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto" // Added w-full for mobile
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
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.address}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.roleColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.joinDateColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.statusColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.actionColumn}</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map(emp => (
                  <tr key={emp._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-3 px-4 text-gray-700">{emp._id}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.phoneNumber}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.address}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.position}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.joinedDate.split("T",1)}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusChanger
                        employeeId={emp._id}
                        employeeName={emp.name}
                        // Todo: need to update status later
                        currentStatus={'active'}
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