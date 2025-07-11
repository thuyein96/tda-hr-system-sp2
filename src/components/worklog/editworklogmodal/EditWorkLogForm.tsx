// EmployeeForm.tsx
import React, { use } from 'react';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { ProductDto } from '@/dtos/product/ProductDto';
import { useWorklogEditForm } from './UseWorklogEditForm';
import { worklogService } from '@/services/worklogService';
import { ChevronDown } from 'lucide-react';
import { worklogUpdateDto } from '@/dtos/worklog/worklogUpdateDto';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    worklogid?: string;
    worklogToEdit?: worklogUpdateDto;
    onSave: (worklog: worklogUpdateDto) => void;
    onClose: () => void;
    employees: EmployeeResponse[];
    products: ProductDto[];
}

const EditWorkLogForm: React.FC<Props> = ({ worklogid, worklogToEdit, onSave, onClose, employees, products }) => {
    const {
        employeeId, setEmployeeId,
        productId, setProductId,
        quantity, setQuantity,

    } = useWorklogEditForm(worklogToEdit);

    const t = useLanguage().translations.workLogPage;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!worklogToEdit.employeeId) {
          console.error("No employee ID provided for update");
          return;
      }

      if(!worklogToEdit.productId) {
          console.error("No product ID provided for update");
      }

      const submittedWorkLogData: worklogUpdateDto = {
          employeeId,
          productId,
          quantity,
      };

      onSave(submittedWorkLogData); // Update UI
      onClose();

      // Async update
      (async () => {
          try {
              await worklogService.updateWorkLog(worklogid, submittedWorkLogData);
          } catch (error) {
              console.error("Error saving worklog:", error);
          }
      })();
    };


    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employee" className="block text-sm font-medium">
            {t.fullNameColumn}
          </label>
          <div className="relative">
            <select
              id="employee"
              value={employeeId} // Use state variable
              onChange={(e) => {
                setEmployeeId(e.target.value);
                const selectedEmployee = employees.find(
                  (emp) => emp._id === e.target.value
                );
              }}
              className="w-full px-4 py-3 border rounded-lg appearance-none"
              required
            >
              <option value="" disabled>
                {t.selectEmployee}
              </option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Role */}
        {/* <div>
          <label className="block text-sm font-medium">{t.roleColumn}</label>
          <input
            type="text"
            value={worklogToEdit.position}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div> */}

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">
            {t.productNameColumn}
          </label>
          <div className="relative">
            <select
              id="product"
              value={worklogToEdit.productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg appearance-none"
              required
            >
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium">
            {t.quantityColumn}
          </label>
          <input
            type="number"
            value={worklogToEdit.quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            {t.cancelButton}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#FF6767] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            {t.editButton}
          </button>
        </div>
      </form>
    );
};

export default EditWorkLogForm;
