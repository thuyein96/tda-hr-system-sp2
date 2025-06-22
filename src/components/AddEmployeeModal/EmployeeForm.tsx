import React from 'react';
import { X } from 'lucide-react';
import { useEmployeeForm } from './useEmployeeForm';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { employeeService } from '@/services/employeeService';

interface Props {
  isEditing: boolean;
  employeeToEdit?: EmployeeResponse;
  onSave: (employee: EmployeeResponse, isEditing: boolean) => void;
  onClose: () => void;
  translations: any;
}

export const EmployeeForm: React.FC<Props> = ({ isEditing, employeeToEdit, onSave, onClose, translations }) => {
  const {
    fullName, setFullName,
    phoneNumber, setPhoneNumber,
    role, setRole,
    joinDate, setJoinDate,
    address, setAddress,
    status, setStatus
  } = useEmployeeForm(employeeToEdit, true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const employeeId = isEditing ? employeeToEdit!._id : `E-${Date.now().toString().slice(-4)}`;
    const id = isEditing ? employeeToEdit!._id : `temp-${Date.now()}`;

    const submittedEmployeeData: EmployeeResponse = {
      _id: id,
      name: fullName,
      phoneNumber,
      address,
      position: role,
      joinedDate: joinDate,
    };

    if (isEditing && employeeToEdit?._id) {
        // Update employee
        await employeeService.updateEmployee(employeeToEdit._id, submittedEmployeeData);
    } else {
        // Create new employee
        await employeeService.createEmployee(submittedEmployeeData);
    }

    onSave(submittedEmployeeData, isEditing);
    onClose();

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-2xl w-full max-w-md mx-auto"> {/* Removed shadow-md */}
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
          {translations.fullNameColumn}
        </label>
        <input
          id="fullName"
          type="text"
          placeholder={translations.fullNamePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          required
        />
      </div>

      {/* Phone Number - Now a single, full-width input */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 mb-1">
          {translations.phoneNumberColumn}
        </label>
        <input
          id="phoneNumber"
          type="text"
          placeholder={translations.phoneNumberPlaceholder}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          required
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">
          {translations.roleColumn}
        </label>
        <input
          id="role"
          type="text"
          placeholder={translations.rolePlaceholder}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          required
        />
      </div>

      {/* Join Date */}
      <div>
        <label htmlFor="joinDate" className="block text-sm font-medium text-gray-600 mb-1">
          {translations.joinDateColumn}
        </label>
        <input
          id="joinDate"
          type="date"
          value={joinDate}
          onChange={(e) => setJoinDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          required
        />
      </div>

      {/* Status Radio Buttons */}
      <div>
        <p className="block text-sm font-medium text-gray-600 mb-1">{translations.selectTypeLabel}</p>
        <div className="flex gap-6 mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={status === 'Active'}
              onChange={() => setStatus('Active')}
              className="form-radio h-5 w-5 text-red-500 border-gray-300 focus:ring-red-400"
            />
            <span className="ml-2 text-sm text-gray-700">{translations.activeStatus}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              value="On leave"
              checked={status === 'On leave'}
              onChange={() => setStatus('On leave')}
              className="form-radio h-5 w-5 text-red-500 border-gray-300 focus:ring-red-400"
            />
            <span className="ml-2 text-sm text-gray-700">{translations.onLeaveStatus}</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
        >
          {translations.cancelButton}
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#FF6767] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          {isEditing ? translations.saveChangesButton : translations.addButton}
        </button>
      </div>
    </form>
  );
};