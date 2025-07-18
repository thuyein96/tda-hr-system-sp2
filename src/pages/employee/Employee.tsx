import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, ChevronLeft, ChevronRight, ChevronDown, Check, X, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { employeeService } from '@/services/employeeService';
import AddEmployeeModal from '@/components/AddEmployeeModal/AddEmployeeModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { EmployeeDto } from '@/dtos/employee/EmployeeDto';
import { ChevronUp } from 'lucide-react';
import EditEmployeeModal from "@/components/EditEmployeeModal/EditEmployeeModal.tsx";
import {EmployeeUpdateDto} from "@/dtos/employee/EmployeeUpdateDto.ts";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  employeeId: string | null;
  employeeName: string;
}

interface EmployeePageTranslations {
  active: string;
  onLeave: string;
  activeStatus: string;
  onLeaveStatus: string;
  totalEmployee: string;
  employees: string;
  sortBy: string;
  joinDate: string;
  addNewEmployee: string;
  fullNameColumn: string;
  employeeIdColumn: string;
  phoneNumberColumn: string;
  address: string;
  roleColumn: string;
  joinDateColumn: string;
  statusColumn: string;
  actionColumn: string;
  editButton: string;
  deleteButton: string;
  showing: string;
  of: string;
}

interface StatusChangerProps {
  employeeId: string;
  employeeName: string;
  currentStatus: string;
  translations: EmployeePageTranslations;
  onStatusChange: (employeeId: string, newStatus: string) => void;
}

const StatusChanger: React.FC<StatusChangerProps> = ({
  employeeId,
  employeeName,
  currentStatus,
  translations,
  onStatusChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getStatusDisplay = (status: string) => {
    return status === 'active' ? translations.active : translations.onLeave;
  };

  const getBadgeStyle = (status: string) => {
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

  const handleStatusChange = async (newStatus: string) => {
    if (isUpdating || newStatus === currentStatus) return;

    try {
      setIsUpdating(true);
      console.log(`Changing status for Employee ID: ${employeeId} (${employeeName}) from "${currentStatus}" to "${newStatus}"`);
      await onStatusChange(employeeId, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentBadgeStyle = getBadgeStyle(currentStatus);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${currentBadgeStyle.bg} ${currentBadgeStyle.text} hover:opacity-80 transition-opacity ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{getStatusDisplay(currentStatus)}</span>
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleStatusChange('active')}
              disabled={isUpdating}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {translations.activeStatus}
            </button>
            <button
              onClick={() => handleStatusChange('on_leave')}
              disabled={isUpdating}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {translations.onLeaveStatus}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface EmployeeProps {
  currentPath?: string;
  searchQuery?: string;
}

const Employee = ({ currentPath, searchQuery = "" }: EmployeeProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteDetails, setEmployeeToDeleteDetails] = useState<{ id: string, name: string } | null>(null);
  const [selectedEmployeeForAdd, setSelectedEmployeeForAdd] = useState<EmployeeResponse | undefined>(undefined);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<EmployeeResponse | undefined>(undefined);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, translations } = useLanguage();
  const employeePageTranslations = translations.employeePage;

  const [sortField, setSortField] = useState<'joinedDate' | 'name' | 'status'>('joinedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

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

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = filteredEmployees.filter(emp => emp.status === 'on_leave').length;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEmployees);
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  };

  const handleOpenAddModal = () => {
    setSelectedEmployeeForAdd(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (employee: EmployeeResponse) => {
    setSelectedEmployeeForEdit(employee);
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = async (newEmployee: EmployeeResponse) => {
  try {
    setIsAddModalOpen(false);
    setSelectedEmployeeForAdd(undefined);
    console.log(`Created new employee:`, newEmployee);
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

    await fetchEmployees();
  } catch (error) {
    console.error('Failed to save employee:', error);
  }
};

  const handleEditEmployee = async (employee: EmployeeResponse) => {
  try {
    if (!selectedEmployeeForEdit || !selectedEmployeeForEdit._id) {
      console.error('No employee selected for editing');
      return;
    }

    await employeeService.updateEmployee(selectedEmployeeForEdit._id, employee);
    setIsEditModalOpen(false);
    setSelectedEmployeeForEdit(undefined);
    console.log(`Updated employee ID: ${selectedEmployeeForEdit._id}`);
    await fetchEmployees();
  } catch (error) {
    console.error('Failed to edit employee:', error);
  }
};


  const handleConfirmDeleteClick = (employee: EmployeeResponse) => {
    setEmployeeToDeleteDetails({ id: employee._id, name: employee.name });
    setIsDeleteConfirmModalOpen(true);
  };

  const handleExecuteDelete = async (id: string) => {
    try {
      await employeeService.deleteEmployee(id);
      console.log(`Successfully deleted employee ID: ${id}`);
      await fetchEmployees();
      const updatedFilteredEmployees = employees.filter(emp => emp._id !== id)
        .filter(emp =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.phoneNumber.includes(searchQuery)
        );
      const newTotalPages = Math.max(1, Math.ceil(updatedFilteredEmployees.length / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
    } finally {
      setIsDeleteConfirmModalOpen(false);
    }
  };

  const handleSortChange = (field: 'joinedDate' | 'name' | 'status') => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    switch (sortField) {
      case 'joinedDate':
        aValue = new Date(a.joinedDate || 0).getTime();
        bValue = new Date(b.joinedDate || 0).getTime();
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'status':
        const order = { active: 1, on_leave: 2 };
        aValue = order[a.status] || 99;
        bValue = order[b.status] || 99;
        break;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentEmployeesSorted = sortedEmployees.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
        <div className="text-sm text-gray-500 animate-pulse">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      await employeeService.updateEmployeeStatus(employeeId, newStatus);
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp._id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
      console.log(`Successfully updated employee ${employeeId} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update employee status:', error);
    }
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center md:justify-evenly gap-4 md:gap-6 shadow-sm">
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.totalEmployee}</p>
              <p className="text-3xl font-bold mt-1">{totalEmployees}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="text-green-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.active}</p>
              <p className="text-3xl font-bold mt-1">{activeEmployees}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{employeePageTranslations.onLeave}</p>
              <p className="text-3xl font-bold mt-1">{onLeaveEmployees}</p>
            </div>
          </div>
        </div>

        {/* Table Header/Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">{employeePageTranslations.employees}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer w-full sm:w-auto"
                >
                  <span className="font-medium text-gray-700">{employeePageTranslations.sortBy}</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {sortField === 'joinedDate' && employeePageTranslations.joinDate}
                    {sortField === 'name' && 'Name'}
                    {sortField === 'status' && 'Status'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute mt-1 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <button
                      onClick={() => { handleSortChange('joinedDate'); setIsSortDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${sortField === 'joinedDate' ? 'font-bold bg-gray-100' : ''} hover:bg-gray-100`}
                    >
                      {employeePageTranslations.joinDate} {sortField === 'joinedDate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </button>
                    <button
                      onClick={() => { handleSortChange('name'); setIsSortDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${sortField === 'name' ? 'font-bold bg-gray-100' : ''} hover:bg-gray-100`}
                    >
                      Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </button>
                    <button
                      onClick={() => { handleSortChange('status'); setIsSortDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${sortField === 'status' ? 'font-bold bg-gray-100' : ''} hover:bg-gray-100`}
                    >
                      Status {sortField === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#EB5757] text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto"
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
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.phoneNumberColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.address}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.roleColumn}</th>
                  <th className="py-3 px-4 font-semibold">{employeePageTranslations.joinDateColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.statusColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{employeePageTranslations.actionColumn}</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployeesSorted.map(emp => (
                  <tr key={emp._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.phoneNumber}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.address}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.position}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {emp.joinedDate?.split("T", 1)[0] || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusChanger
                        employeeId={emp._id}
                        employeeName={emp.name}
                        currentStatus={emp.status}
                        translations={{
                          ...employeePageTranslations,
                          deleteButton: String(employeePageTranslations.deleteButton),
                          editButton: String(employeePageTranslations.editButton),
                        }}
                        onStatusChange={handleStatusChange}
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
              {employeePageTranslations.showing} {totalEmployees > 0 ? startIndex + 1 : 0} {employeePageTranslations.of} {Math.min(endIndex, totalEmployees)} {employeePageTranslations.of} {totalEmployees} {employeePageTranslations.employees}
            </p>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
        addEmployeeDto={
          selectedEmployeeForAdd  
        }
        onSave={handleSaveEmployee}
      />

      {/* Edit Employee Modal */}
        <EditEmployeeModal
          employeeId={selectedEmployeeForEdit?._id || ''}
          editEmployeeDto={selectedEmployeeForEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditEmployee}
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