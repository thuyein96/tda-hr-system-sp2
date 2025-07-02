import { ChevronDown } from 'lucide-react';

export function WorkLogForm({ formData, setters, employees, translations }) {
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
                {emp.name} ({emp.position})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Product Rate */}
      <div>
        <label className="block text-sm font-medium">{t.productRateColumn}</label>
        <input
          type="number"
          value={formData.productRate}
          onChange={e => setters.setProductRate(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          step="0.01"
          required
        />
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

      {/* Date */}
      <div>
        <label className="block text-sm font-medium">{t.dateColumn}</label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setters.setDate(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          required
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium">{t.statusColumn}</label>
        <select
          value={formData.status}
          onChange={e => setters.setStatus(e.target.value as any)}
          className="w-full px-4 py-3 border rounded-lg"
        >
          <option value="On Going">{t.statusOnGoing}</option>
          <option value="Completed">{t.statusCompleted}</option>
          <option value="Rejected">{t.statusRejected}</option>
        </select>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium">{t.noteColumn} ({t.optional})</label>
        <textarea
          value={formData.note}
          onChange={e => setters.setNote(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg min-h-[80px]"
        />
      </div>
    </>
  );
}
