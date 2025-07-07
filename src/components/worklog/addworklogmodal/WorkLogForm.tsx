import { ChevronDown } from 'lucide-react';

export function WorkLogForm({ formData, setters, employees, products, translations }) {
  const t = translations.workLogPage;

  return (
    <>
      <div>
        <label htmlFor="employee" className="block text-sm font-medium">{t.fullNameColumn}</label>
        <div className="relative">
          <select
            id="employee"
            value={formData.selectedEmployeeId}
            onChange={e => setters.handleEmployeeSelect(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg appearance-none"
            required
          >
            <option value="" disabled>{t.selectEmployee}</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">{t.roleColumn}</label>
        <input
          type="text"
          value={formData.role}
          onChange={e => setters.setRole(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          required
        />
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium">{t.productNameColumn}</label>
        <div className="relative">
          <select
            id="product"
            value={formData.selectProductId}
            onChange={e => setters.handleProductSelect(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg appearance-none"
            required
          >
            <option value="" disabled>{t.selectProduct}</option>
            {products.map(prod => (
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
        <label className="block text-sm font-medium">{t.quantityColumn}</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={e => setters.setQuantity(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          required
        />
      </div>

      {/* Date */}
      {/* <div>
        <label className="block text-sm font-medium">{t.dateColumn}</label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setters.setDate(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          required
        />
      </div> */}
    </>
  );
}
