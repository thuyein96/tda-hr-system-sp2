import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { AddEmployeeModalProps } from './types';
import { EmployeeForm } from './EmployeeForm';
import { useLanguage } from '@/contexts/LanguageContext';

export const AddEmployeeModal = ({ isOpen, onClose, employeeToEdit, onSave }: AddEmployeeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.employeePage;
  const isEditing = !!employeeToEdit;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isEditing ? modalTranslations.editEmployeeTitle : modalTranslations.addNewEmployeeTitle}
        </h2>
        <EmployeeForm
          employeeToEdit={employeeToEdit}
          onSave={onSave}
          onClose={onClose}
          translations={modalTranslations}
        />
      </div>
    </div>
  );
};
