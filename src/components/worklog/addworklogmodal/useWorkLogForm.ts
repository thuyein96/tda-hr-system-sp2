import { useState, useEffect } from 'react';

const getTodaysDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useWorkLogForm(workLogToEdit, employees) {
  const isEditing = !!workLogToEdit;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState(getTodaysDate());
  const [status, setStatus] = useState<'On Going' | 'Completed' | 'Rejected'>('On Going');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (workLogToEdit) {
      setSelectedEmployeeId(workLogToEdit.employeeId);
      setFullName(workLogToEdit.fullName);
      setProductRate(workLogToEdit.productRate.toString());
      setQuantity(workLogToEdit.quantity.toString());
      setRole(workLogToEdit.role);
      setDate(workLogToEdit.date);
      setStatus(workLogToEdit.status);
      setNote(workLogToEdit.note);
    } else if (employees.length > 0) {
      const defaultEmp = employees[0];
      setSelectedEmployeeId(defaultEmp._id);
      setFullName(defaultEmp.name);
      setRole(defaultEmp.position);
      setProductRate('');
      setQuantity('');
      setDate(getTodaysDate());
      setStatus('On Going');
      setNote('');
    }
  }, [workLogToEdit, employees]);

  const handleEmployeeSelect = (id: string) => {
    const emp = employees.find(e => e._id === id);
    setSelectedEmployeeId(id);
    setFullName(emp?.name || '');
    setRole(emp?.position || '');
  };

  const buildWorkLogData = () => ({
    _id: isEditing ? workLogToEdit._id : `temp-${Date.now()}`,
    employeeId: selectedEmployeeId,
    fullName,
    productRate: parseFloat(productRate),
    quantity: parseInt(quantity),
    role,
    date,
    status,
    note,
  });

  return {
    isEditing,
    formData: {
      selectedEmployeeId, fullName, productRate, quantity, role, date, status, note
    },
    setters: {
      setProductRate, setQuantity, setRole, setDate, setStatus, setNote, handleEmployeeSelect
    },
    buildWorkLogData,
  };
}
