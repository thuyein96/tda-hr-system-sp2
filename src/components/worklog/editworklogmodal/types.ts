import { EmployeeResponse } from "@/dtos/employee/EmployeeResponse";
import { ProductDto } from "@/dtos/product/ProductDto";
import { worklogUpdateDto } from "@/dtos/worklog/worklogUpdateDto";

export interface EditWorkLogModalProps {
  worklogid: string;
  isOpen: boolean;
  onClose: () => void;
  workLogToEdit?: worklogUpdateDto;
  onSave: (workLog: worklogUpdateDto) => void;
  employees: EmployeeResponse[];
  products: ProductDto[];
}