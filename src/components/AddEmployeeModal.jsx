import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage hook


const AddEmployeeModal = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage(); // Get translations from context
  const modalTranslations = translations.employeePage; // Assuming modal translations are part of employeePage

  const [fullName, setFullName] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'On leave'>('Active');

  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setBaseRate('');
      setPhoneNumber('');
      setRole('');
      setJoinDate('');
      setStatus('Active');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) { // Removed TypeScript type annotation
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted (UI Only). Data captured:", {
      fullName, baseRate, phoneNumber, role, joinDate, status
    });
    onClose(); // Close modal after 'submission'
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
          {modalTranslations.addNewEmployeeTitle}
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
              type="text"
              placeholder={modalTranslations.joinDatePlaceholder}
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
              {modalTranslations.addButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
