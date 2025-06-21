// src/components/AddEditExpenseModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
// Update the import path below if your LanguageContext is located elsewhere
import { useLanguage } from '../contexts/LanguageContext';

// Data Interface for Expense (re-declared for clarity in this component)
interface ExpenseEntry {
  id: string;
  name: string;
  amount: number;
  paidTo: string; // Changed from category to paidTo as per image
  date: string; // YYYY-MM-DD
  note: string;
}

interface AddEditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseEntryToEdit: ExpenseEntry | null;
  onSave: (entry: ExpenseEntry, isEditing: boolean) => void;
}

const AddEditExpenseModal = ({ isOpen, onClose, expenseEntryToEdit, onSave }: AddEditExpenseModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();
  const modalTranslations = translations.expenseIncomePage;

  const isEditing = !!expenseEntryToEdit;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState(''); // Changed from category to paidTo
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  // Set initial form values when modal opens or entryToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (expenseEntryToEdit) {
        setName(expenseEntryToEdit.name);
        setAmount(expenseEntryToEdit.amount.toString());
        setPaidTo(expenseEntryToEdit.paidTo); // Use paidTo
        setDate(expenseEntryToEdit.date);
        setNote(expenseEntryToEdit.note);
      } else {
        setName('');
        setAmount('');
        setPaidTo(''); // Use paidTo
        setDate(new Date().toISOString().split('T')[0]); // Default to today's date
        setNote('');
      }
    }
  }, [isOpen, expenseEntryToEdit]);

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
    
    const submittedAmount = parseFloat(amount);
    if (isNaN(submittedAmount) || submittedAmount <= 0) {
      alert(modalTranslations.invalidAmount);
      return;
    }

    const id = isEditing ? expenseEntryToEdit!.id : `expense-${Date.now()}`;
    const newEntry: ExpenseEntry = { id, name, amount: submittedAmount, paidTo, date, note }; // Use paidTo

    console.log(`[UI-ONLY] ${isEditing ? 'Editing' : 'Adding'} Expense entry. Data captured for backend:`, newEntry);
    onSave(newEntry, isEditing);
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
          {isEditing ? modalTranslations.editExpenseTitle : modalTranslations.addNewExpenseTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="expenseName" className="block text-sm font-medium text-gray-600 mb-1">
              {modalTranslations.expenseNameColumn}
            </label>
            <input
              type="text"
              id="expenseName"
              placeholder={modalTranslations.expenseNamePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.amountColumn}</label>
            <input
              type="number"
              id="expenseAmount"
              placeholder="e.g., 100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
              min="0.01"
              step="any"
            />
          </div>
          <div>
            <label htmlFor="expensePaidTo" className="block text-sm font-medium text-gray-600 mb-1">
              {modalTranslations.paidToColumn} {/* Changed to paidToColumn */}
            </label>
            <input
              type="text"
              id="expensePaidTo"
              // Changed to paidToPlaceholder
              placeholder={modalTranslations.paidToPlaceholder}
              value={paidTo}
              onChange={(e) => setPaidTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.dateColumn}</label>
            <input
              type="date"
              id="expenseDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>
          <div>
            <label htmlFor="expenseNote" className="block text-sm font-medium text-gray-600 mb-1">{modalTranslations.noteColumn} ({modalTranslations.optional})</label>
            <textarea
              id="expenseNote"
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
              {isEditing ? modalTranslations.saveChangesButton : modalTranslations.addButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditExpenseModal;
