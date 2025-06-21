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
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
        <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.fullNamePlaceholder}
            </label>
            <input
            id="fullName"
            type="text"
            placeholder={translations.fullNamePlaceholder}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            />
        </div>

        <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.phoneNumberPlaceholder}
            </label>
            <input
            id="phoneNumber"
            type="text"
            placeholder={translations.phoneNumberPlaceholder}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            />
        </div>

        <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.rolePlaceholder}
            </label>
            <input
            id="role"
            type="text"
            placeholder={translations.rolePlaceholder}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            />
        </div>

        <div>
            <label htmlFor="joinDate" className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.joinDatePlaceholder}
            </label>
            <input
            id="joinDate"
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            />
        </div>

        <div>
            <p className="text-gray-700 font-semibold mb-2">{translations.selectTypeLabel}</p>
            <div className="flex gap-6">
            <label className="inline-flex items-center">
                <input
                type="radio"
                name="status"
                value="Active"
                checked={status === 'Active'}
                onChange={() => setStatus('Active')}
                className="form-radio text-blue-500 h-5 w-5"
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
                className="form-radio text-blue-500 h-5 w-5"
                />
                <span className="ml-2 text-sm text-gray-700">{translations.onLeaveStatus}</span>
            </label>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
            {translations.cancelButton}
            </button>
            <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
            {isEditing ? translations.saveChangesButton : translations.addButton}
            </button>
        </div>
    </form>
  );
};
