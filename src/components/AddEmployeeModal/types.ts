import { EmployeeDto } from "@/dtos/employee/EmployeeDto";
import { EmployeeResponse } from "@/dtos/employee/EmployeeResponse";

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: EmployeeResponse;
  onSave: (employee: EmployeeDto) => void;
}
