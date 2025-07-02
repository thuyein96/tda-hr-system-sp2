import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useWorkLogForm } from './useWorkLogForm';
import { WorkLogForm } from './WorkLogForm';
import { useLanguage } from '@/contexts/LanguageContext';

export const AddWorkLogModal = ({ isOpen, onClose, workLogToEdit, onSave, employees }) => {
  const modalRef = useRef(null);
  const { translations } = useLanguage();
  const t = translations.workLogPage;

  const {
    isEditing,
    formData,
    setters,
    buildWorkLogData
  } = useWorkLogForm(workLogToEdit, employees);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedEmployeeId || !formData.fullName) {
      alert("Please select an employee.");
      return;
    }
    const data = buildWorkLogData();
    onSave(data, isEditing);
    onClose();
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
