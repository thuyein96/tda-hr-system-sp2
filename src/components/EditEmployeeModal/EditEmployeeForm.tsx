// EmployeeForm.tsx
import React from 'react';
import { useEditEmployeeForm } from './useEditEmployeeForm';
import { employeeService } from '@/services/employeeService';
import {EmployeeUpdateDto} from "@/dtos/employee/EmployeeUpdateDto.ts";

interface Props {
    employeeId?: string;
    editEmployeeDto?: EmployeeUpdateDto;
    onSave: (employee: EmployeeUpdateDto) => void;
    onClose: () => void;
    translations: any;
}

const EditEmployeeForm: React.FC<Props> = ({ employeeId, editEmployeeDto, onSave, onClose, translations }) => {
    const {
        fullName, setFullName,
        phoneNumber, setPhoneNumber,
        role, setRole,
        joinDate, setJoinDate,
        address, setAddress,
        status, setStatus
    } = useEditEmployeeForm(editEmployeeDto);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submittedEmployeeData: EmployeeUpdateDto = {
            name: fullName,
            phoneNumber,
            address,
            position: role,
            status,
            joinedDate: joinDate,
        };

        // Update UI immediately and close modal
        onSave(submittedEmployeeData);
        onClose();

        // Run API call in background, no await
        (async () => {
            try {
                if (editEmployeeDto !== null) {
                    await employeeService.updateEmployee(employeeId, submittedEmployeeData);
                }
            } catch (error) {
                console.error('Error saving employee:', error);
            }
        })();
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
                    {translations.addressColumn}
                </label>
                <input
                    id="address"
                    type="text"
                    placeholder={translations.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                />
            </div>

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

            <div>
                <p className="block text-sm font-medium text-gray-600 mb-1">{translations.selectTypeLabel}</p>
                <div className="flex gap-6 mt-2">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={status === 'active'}
                            onChange={() => setStatus('active')}
                            className="form-radio h-5 w-5 text-red-500 border-gray-300 focus:ring-red-400"
                        />
                        <span className="ml-2 text-sm text-gray-700">{translations.activeStatus}</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="on_leave"
                            checked={status === 'on_leave'}
                            onChange={() => setStatus('on_leave')}
                            className="form-radio h-5 w-5 text-red-500 border-gray-300 focus:ring-red-400"
                        />
                        <span className="ml-2 text-sm text-gray-700">{translations.onLeaveStatus}</span>
                    </label>
                </div>
            </div>

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
                    {translations.editButton}
                </button>
            </div>
        </form>
    );
};

export default EditEmployeeForm;
