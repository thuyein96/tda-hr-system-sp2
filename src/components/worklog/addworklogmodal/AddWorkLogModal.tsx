import { useRef, useEffect } from 'react';
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

export const AddWorkLogModal = ({ isOpen, onClose, workLogToEdit, onSave, employees, products }: AddWorkLogModalProps) => {
  const modalRef = useRef(null);
  const { translations } = useLanguage();
  const t = translations.workLogPage;

  const {
    isEditing,
    formData,
    setters,
  } = useWorkLogForm(workLogToEdit, employees, products);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedEmployeeId) {
      toast.error("Please select an employee.");
      return;
    }
    if (!formData.selectProductId) {
      toast.error("Please select a product.");
      return;
    }

    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity (must be a positive number).");
      return;
    }

    try {
      if (isEditing && workLogToEdit) {
        // Update existing worklog
        const updateData: Partial<worklogCreateDto> = {
          employeeId: formData.selectedEmployeeId,
          productId: formData.selectProductId,
          quantity: quantity,
        };
        
        const response = await worklogService.updateWorklog(workLogToEdit._id, updateData);
        onSave(response);
        toast.success("Work log updated successfully!");
      } else {
        // Create new worklog
        const data: worklogCreateDto = {
          employeeId: formData.selectedEmployeeId,
          productId: formData.selectProductId,
          quantity: quantity,
        };
        
        const response = await worklogService.createWorkLog(data);
        onSave(response);
        toast.success("Work log created successfully!");
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving work log:', error);
      toast.error("Failed to save work log. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {t.cancelButton}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF6767] text-white rounded-lg hover:bg-red-600"
            >
              {isEditing ? t.saveChangesButton : t.addWorkLogButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
