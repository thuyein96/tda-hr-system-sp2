import { EmployeeDto } from "@/dtos/employee/EmployeeDto";
import { EmployeeResponse } from "@/dtos/employee/EmployeeResponse";

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  addEmployeeDto?: EmployeeResponse;
  onSave: (employee: EmployeeDto) => void;
}
