import { EmployeeDto } from '@/dtos/employee/EmployeeDto';
import { useEffect, useState } from 'react';

export function useEmployeeForm(employeeToEdit?: EmployeeDto, isOpen?: boolean) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'active' | 'on_leave'>('active');

  useEffect(() => {
    if (isOpen) {
      setFullName(employeeToEdit?.name || '');
      setPhoneNumber(employeeToEdit?.phoneNumber || '');
      setRole(employeeToEdit?.position || '');
      setJoinDate(employeeToEdit?.joinedDate || '');
      setAddress(employeeToEdit?.address || '');
      setStatus('active'); // Default or edit from future backend status
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
