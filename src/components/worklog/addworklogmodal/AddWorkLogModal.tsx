import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useWorkLogForm } from './useWorkLogForm';
import { WorkLogForm } from './WorkLogForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { worklogService } from '@/services/worklogService';
import { worklogCreateDto } from '@/dtos/worklog/worklogCreateDto';
import { toast } from 'react-hot-toast';
import { worklogData } from '@/dtos/worklog/worklogData';

interface AddWorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  workLogToEdit?: worklogData;
  onSave: (workLog: any) => void;
  employees: any[];
  products: any[];
}

export const AddWorkLogModal = ({
  isOpen,
  onClose,
  workLogToEdit,
  onSave,
  employees,
  products,
}: AddWorkLogModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const t = translations.workLogPage;

  const { isEditing, formData, setters } = useWorkLogForm(workLogToEdit, employees, products);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (!loading) onClose();  // Prevent closing while loading
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.selectedEmployeeId) {
      toast.error(t.selectEmployee || "Please select an employee.");
      return;
    }
    if (!formData.selectProductId) {
      toast.error(t.selectProduct || "Please select a product.");
      return;
    }

    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error(t.invalidQuantityError || "Please enter a valid quantity (must be a positive number).");
      return;
    }

    setLoading(true);  // Start loading

    try {
      if (isEditing && workLogToEdit) {
        const updateData: Partial<worklogCreateDto> = {
          employeeId: formData.selectedEmployeeId,
          productId: formData.selectProductId,
          quantity,
        };

        const response = await worklogService.updateWorkLog(workLogToEdit._id, updateData);
        onSave(response);
        toast.success(t.updateSuccess || "Work log updated successfully!");
      } else {
        const data: worklogCreateDto = {
          employeeId: formData.selectedEmployeeId,
          productId: formData.selectProductId,
          quantity,
        };

        const response = await worklogService.createWorkLog(data);
        onSave(response);
        toast.success(t.createdSuccess || "Work log created successfully!");
      }
      onClose();
    } catch (error) {
      console.error('Error saving work log:', error);
      toast.error(t.saveFailed || "Failed to save work log. Please try again.");
    } finally {
      setLoading(false);  // End loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={() => !loading && onClose()}
          disabled={loading}
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditing ? t.editWorkLogTitle : t.addNewWorkLogTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <WorkLogForm
            formData={formData}
            setters={setters}
            employees={employees}
            products={products}
            translations={translations}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => !loading && onClose()}
              disabled={loading}
              className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {t.cancelButton}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-[#FF6767] text-white rounded-lg hover:bg-red-600 flex items-center justify-center ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  {isEditing ? t.savingButton || "Saving..." : t.savingButton || "Saving..."}
                </>
              ) : isEditing ? (
                t.saveChangesButton
              ) : (
                t.addWorkLogButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};