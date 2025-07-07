import { set } from 'date-fns';
import { useState, useEffect } from 'react';

// const getTodaysDate = (): string => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0'); 
//   const day = String(today.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

export function useWorkLogForm(workLogToEdit, employees, products) {
  const isEditing = !!workLogToEdit;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectProductId, setSelectProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState();
  const [role, setRole] = useState('');

  useEffect(() => {
    if (workLogToEdit) {
      setSelectedEmployeeId(workLogToEdit.employeeId);
      setFullName(workLogToEdit.fullName);
      setSelectProductId(workLogToEdit.productId);
      setProductName(workLogToEdit.productName);
      setQuantity(workLogToEdit.quantity);
      setRole(workLogToEdit.role);
    } else if (employees.length > 0) {
      const defaultEmp = employees[0];
      setSelectedEmployeeId(defaultEmp._id);
      setFullName(defaultEmp.name);
      setRole(defaultEmp.position);
      setSelectProductId('');
      setProductName('');
      setQuantity(undefined);
    }
  }, [workLogToEdit, employees]);

  const handleEmployeeSelect = (id: string) => {
    const emp = employees.find(e => e._id === id);
    setSelectedEmployeeId(id);
    setFullName(emp?.name || '');
  };

  const handleProductSelect = (id: string) => {
    const product = products.find(p => p._id === id);
    setSelectProductId(id);
    setProductName(product?.name || '');
  };

  const calculateTotalPrice = (id: string, quantity: number) => {
    const product = products.find(p => p._id === selectProductId);
    if (product && quantity) {
      return product.price * quantity;
    }
    return 0;
  };

  return {
    isEditing,
    formData: {
      selectedEmployeeId, fullName, selectProductId, productName, quantity, role
    },
    setters: {
      setQuantity, setRole, handleEmployeeSelect, handleProductSelect
    },
    calculateTotalPrice
  };
}
