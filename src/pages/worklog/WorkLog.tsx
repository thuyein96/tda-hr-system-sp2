import React, { useState, useEffect, useRef } from 'react';
import { Users, ClipboardList, DollarSign, Plus, ChevronDown, Edit, Trash2, X, ChevronLeft, ChevronRight, Box } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { ProductService } from '@/services/ProductService';
import { employeeService } from '@/services/employeeService';
import { worklogService } from '@/services/worklogService';
import { worklogData } from '@/dtos/worklog/worklogData';
import { AddWorkLogModal } from '@/components/worklog/addworklogmodal/AddWorkLogModal';
import { ProductDto } from '@/dtos/product/ProductDto';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { toast } from 'react-hot-toast';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  workLogId: string | null;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, workLogId }: ConfirmDeleteModalProps) => {
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
          {modalTranslations.confirmDeleteMessage1} <span className="font-semibold text-red-600"></span>{modalTranslations.confirmDeleteMessage2}
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

interface WorkLogProps {
  currentPath?: string;
}

const WorkLog = ({ currentPath }: WorkLogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [workLogToDeleteDetails, setWorkLogToDeleteDetails] = useState<{ id: string } | null>(null);
  const [selectedWorkLogForEdit, setSelectedWorkLogForEdit] = useState<worklogData | undefined>(undefined);
  const [workLogs, setWorkLogs] = useState<worklogData[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { translations } = useLanguage();
  const workLogPageTranslations = translations.workLogPage;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [employeeData, productData, worklogData] = await Promise.all([
          employeeService.getAllEmployees(),
          ProductService.getAllProducts(),
          worklogService.getAllWorklogs()
        ]);

        setEmployees(employeeData);
        setProducts(productData);

        // Transform worklog data to include employee and product details
        const transformedWorkLogs = worklogData.map(log => {
          const employee = employeeData.find(emp => emp._id === log.employeeId);
          const product = productData.find(prod => prod._id === log.productId);
          
          return {
            _id: log._id,
            employeeId: log.employeeId,
            productId: log.productId,
            fullname: employee ? employee.name : 'Unknown Employee',
            position: employee ? employee.position : 'Unknown Position',
            productName: product ? product.name : 'Unknown Product',
            quantity: log.quantity,
            totalPrice: log.totalPrice,
            updatedAt: log.updatedAt,
          } as worklogData;
        });

        setWorkLogs(transformedWorkLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter work logs based on search query
  const filteredWorkLogs = workLogs.filter(log => {
    const matchesSearchQuery =
      log.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.quantity.toString().includes(searchQuery) ||
      log.totalPrice.toString().includes(searchQuery);
    return matchesSearchQuery;
  });

  const totalWorkLogs = filteredWorkLogs.length;
  const totalQuantityProduced = filteredWorkLogs.reduce((sum, log) => sum + log.quantity, 0);
  const totalCompletedWorklogs = filteredWorkLogs.length; // Placeholder logic

  const totalPages = Math.ceil(totalWorkLogs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkLogs = filteredWorkLogs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenAddModal = () => {
    setSelectedWorkLogForEdit(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (workLog: worklogData) => {
    setSelectedWorkLogForEdit(workLog);
    setIsAddModalOpen(true);
  };

  const handleSaveWorkLog = async (workLogData: any) => {
    try {
      // Refresh the worklog list to get updated data
      const [employeeData, productData, worklogData] = await Promise.all([
        employeeService.getAllEmployees(),
        ProductService.getAllProducts(),
        worklogService.getAllWorklogs()
      ]);

      // Transform worklog data to include employee and product details
      const transformedWorkLogs = worklogData.map(log => {
        const employee = employeeData.find(emp => emp._id === log.employeeId);
        const product = productData.find(prod => prod._id === log.productId);
        
        return {
          _id: log._id,
          employeeId: log.employeeId,
          productId: log.productId,
          fullname: employee ? employee.name : 'Unknown Employee',
          position: employee ? employee.position : 'Unknown Position',
          productName: product ? product.name : 'Unknown Product',
          quantity: log.quantity,
          // totalPrice: log.totalPrice,
          // updatedAt: log.updatedAt,
        } as worklogData;
      });

      setWorkLogs(transformedWorkLogs);
    } catch (error) {
      console.error('Error refreshing work logs:', error);
      toast.error("Failed to refresh work log list.");
    }
  };

  const handleConfirmDeleteClick = (workLog: worklogData) => {
    setWorkLogToDeleteDetails({ id: workLog._id });
    setIsDeleteConfirmModalOpen(true);
  };

  const handleExecuteDelete = async (id: string) => {
    try {
      await worklogService.deleteWorkLog(id);
      setWorkLogs(prevLogs => prevLogs.filter(log => log._id !== id));
      toast.success("Work log deleted successfully!");
    } catch (error) {
      console.error('Error deleting work log:', error);
      toast.error("Failed to delete work log. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-8">{translations.common.loading}...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{translations.common.error}: {error}</div>;

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center md:justify-evenly gap-4 md:gap-6 shadow-sm">
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardList className="text-red-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{workLogPageTranslations.totalWorkLogs}</p>
              <p className="text-3xl font-bold mt-1">{totalWorkLogs}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-grow md:flex-grow-0 md:w-auto w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardList className="text-green-500 w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{workLogPageTranslations.totalCompletedWorklogs}</p>
              <p className="text-3xl font-bold mt-1">{totalCompletedWorklogs}</p>
            </div>
          </div>

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

        {/* Table Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">{workLogPageTranslations.workLogsTitle}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.roleColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.productNameColumn}</th>
                  <th className="py-3 px-4 font-semibold">{workLogPageTranslations.quantityColumn}</th>
                  <th className="py-3 px-4 font-semibold text-center">{workLogPageTranslations.actionColumn}</th>
                </tr>
              </thead>
              <tbody>
                {currentWorkLogs.map(log => (
                  <tr key={log._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{log.fullname}</td>
                    <td className="py-3 px-4 text-gray-700">{log.position}</td>
                    <td className="py-3 px-4 text-gray-700">{log.productName}</td>
                    <td className="py-3 px-4 text-gray-700">{log.quantity}</td>
                    {/* <td className="py-3 px-4 text-gray-700">{log.totalPrice}</td>
                    <td className="py-3 px-4 text-gray-700">{new Date(log.updatedAt).toLocaleDateString()}</td> */}
                    {/* NEW: Dropdown for Status in each table row */}
                    {/* <td className="py-3 px-4 text-left">
                      
                    </td> */}
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

      {/* Add Work Log Modal */}
      <AddWorkLogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        workLogToEdit={selectedWorkLogForEdit}
        onSave={handleSaveWorkLog}
        employees={employees}
        products={products}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleExecuteDelete}
        workLogId={workLogToDeleteDetails?.id || null}
      />
    </div>
  );
};

export default WorkLog;
