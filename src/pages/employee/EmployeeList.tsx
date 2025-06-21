// src/pages/EmployeeListPage.tsx (Example Component)
// this one is for searching employees : Hein Thant ( will implement this later )
import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams

// Define a more comprehensive Employee interface
interface Employee {
  id: string; // Changed to string to simplify search comparison, or handle as number
  name: string;
  department: string;
  position: string;
  email: string;
  baseRate: number; // For example, USD per hour
  status: 'Active' | 'On Leave' | 'Terminated';
  // Add other relevant fields as needed
}

const EmployeeListPage = () => { // Removed currentPath prop as it's not used directly here
  const [searchParams] = useSearchParams(); // Get the search params from the URL
  const searchQuery = searchParams.get('q') || ''; // Get the 'q' parameter

  // Your employee data (mock data for demonstration)
  // In a real application, this would come from an API call
  const allEmployees: Employee[] = [
    { id: "EMP001", name: "Alice Smith", department: "HR", position: "HR Manager", email: "alice.s@example.com", baseRate: 50.00, status: 'Active' },
    { id: "EMP002", name: "Bob Johnson", department: "Finance", position: "Accountant", email: "bob.j@example.com", baseRate: 45.00, status: 'Active' },
    { id: "EMP003", name: "Charlie Brown", department: "IT", position: "Software Engineer", email: "charlie.b@example.com", baseRate: 60.00, status: 'Active' },
    { id: "EMP004", name: "David Lee", department: "HR", position: "HR Assistant", email: "david.l@example.com", baseRate: 35.00, status: 'On Leave' },
    { id: "EMP005", name: "Eve Davis", department: "Sales", position: "Sales Representative", email: "eve.d@example.com", baseRate: 40.00, status: 'Active' },
    { id: "EMP006", name: "Frank White", department: "IT", position: "IT Support", email: "frank.w@example.com", baseRate: 48.00, status: 'Active' },
    // Add more employees as needed
  ];

  // Convert search query to lowercase for case-insensitive comparison
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  // Filter employees based on the searchQuery across multiple fields
  const filteredEmployees = allEmployees.filter(employee => {
    // Check if the search query is present in any of the relevant fields
    return (
      employee.name.toLowerCase().includes(lowerCaseSearchQuery) ||
      employee.department.toLowerCase().includes(lowerCaseSearchQuery) ||
      employee.position.toLowerCase().includes(lowerCaseSearchQuery) ||
      employee.email.toLowerCase().includes(lowerCaseSearchQuery) ||
      employee.status.toLowerCase().includes(lowerCaseSearchQuery) ||
      // Convert ID to string for includes() comparison
      employee.id.toLowerCase().includes(lowerCaseSearchQuery) ||
      // Convert baseRate to string for includes() comparison (e.g., searching "45" might find Bob)
      String(employee.baseRate).includes(lowerCaseSearchQuery)
      // Add more fields here as you deem necessary for search
    );
  });

  return (
    <div className="employee-list-page">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      {searchQuery && (
        <p className="mb-4 text-gray-600">
          Showing results for: <span className="font-semibold">"{searchQuery}"</span>
        </p>
      )}

      {filteredEmployees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Position</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Base Rate</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{employee.id}</td>
                  <td className="py-3 px-6 text-left">{employee.name}</td>
                  <td className="py-3 px-6 text-left">{employee.department}</td>
                  <td className="py-3 px-6 text-left">{employee.position}</td>
                  <td className="py-3 px-6 text-left">{employee.email}</td>
                  <td className="py-3 px-6 text-left">${employee.baseRate.toFixed(2)}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No employees found matching "{searchQuery}".</p>
      )}
    </div>
  );
};

export default EmployeeListPage;