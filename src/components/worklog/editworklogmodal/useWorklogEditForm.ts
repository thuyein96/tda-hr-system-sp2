// useEmployeeForm.ts
import { useState, useEffect } from 'react';
import { worklogUpdateDto } from '@/dtos/worklog/worklogUpdateDto';

export const useWorklogEditForm = (worklogToEdit?: worklogUpdateDto) => {
    const [employeeId, setEmployeeId] = useState<string>('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [productId, setProductId] = useState<string>('');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState<number | undefined>();

    useEffect(() => {
        if (worklogToEdit) {
            setEmployeeId(worklogToEdit.employeeId);
            setProductId(worklogToEdit.productId);
            setQuantity(worklogToEdit.quantity);
        } else {
            setEmployeeId('');
            setProductId('');
            setFullName('');
            setRole('');
            setProductName('');
            setQuantity(undefined);
        }
    }, [worklogToEdit]);

    return {
        employeeId, setEmployeeId,
        productId, setProductId,
        fullName, setFullName,
        role, setRole,
        productName, setProductName,
        quantity, setQuantity
    };
};
