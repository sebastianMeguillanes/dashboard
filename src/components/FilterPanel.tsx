import { useState } from 'react';
import { Filter, X, Calendar, ChevronDown } from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';
import { format } from 'date-fns';

export function FilterPanel() {
  const { filters, setFilters, resetFilters, availableOptions, filteredEntries } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    filters.clients.length,
    filters.projects.length,
    filters.sectors.length,
    filters.areas.length,
    filters.users.length,
    filters.statuses.length,
    filters.practices.length
  ].reduce((sum, count) => sum + count, 0);

  const MultiSelectFilter = ({
    label,
    options,
    selected,
    onChange
  }: {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <span>{label} {selected.length > 0 && `(${selected.length})`}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {options.map(option => (
              <label key={option} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, option]);
                    } else {
                      onChange(selected.filter(v => v !== option));
                    }
                  }}
                  className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="truncate">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {format(filters.dateRange.start, 'dd/MM/yyyy')} - {format(filters.dateRange.end, 'dd/MM/yyyy')}
              </span>
            </div>

            <div className="text-sm text-gray-400">
              <span className="text-white font-medium">{filteredEntries.length}</span> registros
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MultiSelectFilter
              label="Clientes"
              options={availableOptions.clients}
              selected={filters.clients}
              onChange={(clients) => setFilters({ clients })}
            />
            <MultiSelectFilter
              label="Proyectos"
              options={availableOptions.projects}
              selected={filters.projects}
              onChange={(projects) => setFilters({ projects })}
            />
            <MultiSelectFilter
              label="Sectores"
              options={availableOptions.sectors}
              selected={filters.sectors}
              onChange={(sectors) => setFilters({ sectors })}
            />
            <MultiSelectFilter
              label="Áreas"
              options={availableOptions.areas}
              selected={filters.areas}
              onChange={(areas) => setFilters({ areas })}
            />
            <MultiSelectFilter
              label="Colaboradores"
              options={availableOptions.users}
              selected={filters.users}
              onChange={(users) => setFilters({ users })}
            />
            <MultiSelectFilter
              label="Estados"
              options={availableOptions.statuses}
              selected={filters.statuses}
              onChange={(statuses) => setFilters({ statuses })}
            />
            <MultiSelectFilter
              label="Prácticas"
              options={availableOptions.practices}
              selected={filters.practices}
              onChange={(practices) => setFilters({ practices })}
            />
          </div>
        </div>
      )}
    </>
  );
}
