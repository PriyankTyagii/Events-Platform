'use client';

interface FiltersProps {
  city: string;
  setCity: (city: string) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  status: string[];
  setStatus: (status: string[]) => void;
  onRefresh: () => void;
}

export function Filters({
  city,
  setCity,
  keyword,
  setKeyword,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  status,
  setStatus,
  onRefresh,
}: FiltersProps) {
  const statuses = ['new', 'updated', 'inactive', 'imported'];

  const toggleStatus = (s: string) => {
    if (status.includes(s)) {
      setStatus(status.filter(st => st !== s));
    } else {
      setStatus([...status, s]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          >
            <option value="Sydney">Sydney</option>
            <option value="Melbourne">Melbourne</option>
            <option value="Brisbane">Brisbane</option>
          </select>
        </div>

        {/* Keyword Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search title, venue..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                status.includes(s)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
