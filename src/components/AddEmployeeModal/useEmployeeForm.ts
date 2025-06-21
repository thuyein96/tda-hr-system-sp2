import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { useEffect, useState } from 'react';

export function useEmployeeForm(employeeToEdit?: EmployeeResponse, isOpen?: boolean) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'Active' | 'On leave'>('Active');

  useEffect(() => {
    if (isOpen) {
      setFullName(employeeToEdit?.name || '');
      setPhoneNumber(employeeToEdit?.phoneNumber || '');
      setRole(employeeToEdit?.position || '');
      setJoinDate(employeeToEdit?.joinedDate || '');
      setAddress(employeeToEdit?.address || '');
      setStatus('Active'); // Default or edit from future backend status
    }
  }, [employeeToEdit, isOpen]);

  return {
    fullName, setFullName,
    phoneNumber, setPhoneNumber,
    role, setRole,
    joinDate, setJoinDate,
    address, setAddress,
    status, setStatus,
  };
}
