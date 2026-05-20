import { useState, useEffect } from 'react';
import { Filter, X, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

// Local type for react-day-picker range selection (avoid direct import issues)
type DayRange = { from?: Date | undefined; to?: Date | undefined } | undefined;
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../app/components/ui/dialog';
import { Calendar } from '../app/components/ui/calendar';

export function FilterPanel() {
  const { filters, setFilters, resetFilters, availableOptions, filteredEntries } = useFilters();
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DayRange>({
    from: filters.dateRange.start,
    to: filters.dateRange.end
  });

  useEffect(() => {
    setSelectedRange({ from: filters.dateRange.start, to: filters.dateRange.end });
  }, [filters.dateRange.start, filters.dateRange.end]);

  const activeFiltersCount = [
    filters.clients.length,
    filters.projects.length,
    filters.sectors.length,
    filters.areas.length,
    filters.users.length,
    filters.statuses.length,
    filters.practices.length
  ].reduce((sum, count) => sum + count, 0);

  const setDateRange = (start: Date, end: Date) => {
    setFilters({ dateRange: { start, end } });
  };

  const presets = [
    {
      label: 'Este mes',
      range: {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      }
    },
    {
      label: 'Últimos 3 meses',
      range: {
        start: startOfMonth(subMonths(new Date(), 2)),
        end: endOfMonth(new Date())
      }
    },
    {
      label: 'Últimos 6 meses',
      range: {
        start: startOfMonth(subMonths(new Date(), 5)),
        end: endOfMonth(new Date())
      }
    }
  ];


  const handleRangeSelect = (range: DayRange) => {
    setSelectedRange(range);
    if (range?.from && range.to) {
      setDateRange(range.from, range.to);
    }
  };

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
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <span>{label} {selected.length > 0 && `(${selected.length})`}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
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
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros</DialogTitle>
                  <DialogDescription>
                    Usa el calendario para seleccionar fechas y ajusta los filtros del dashboard.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-800 bg-gray-950 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Rango de fechas</p>
                          <p className="text-sm text-white">
                            {format(filters.dateRange.start, 'dd/MM/yyyy')} - {format(filters.dateRange.end, 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {presets.map(preset => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                setSelectedRange({ from: preset.range.start, to: preset.range.end });
                                setDateRange(preset.range.start, preset.range.end);
                              }}
                              className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-300 hover:bg-gray-800"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 rounded-3xl border border-gray-800 bg-gray-900 p-3">
                        <Calendar
                          mode="range"
                          selected={selectedRange as any}
                          onSelect={(r: any) => handleRangeSelect(r)}
                          className="rounded-3xl border border-gray-800"
                        />
                      </div>
                    </div>

                    {/* Insights removed from modal by user request */}
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-800 bg-gray-950 p-4">
                      <p className="text-sm text-gray-400 mb-4">Filtros avanzados</p>
                      <div className="grid grid-cols-1 gap-4">
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
                  </div>
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={saving}
                    className="inline-flex justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setSaving(true);
                      // small delay to simulate loading data
                      await new Promise((res) => setTimeout(res, 1000));
                      setSaving(false);
                      setOpen(false);
                    }}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Cargando...
                      </>
                    ) : (
                      'Guardar y cerrar'
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Floating filter button: always visible */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir filtros"
              className="fixed right-6 bottom-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Filtros</span>
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CalendarIcon className="w-4 h-4" />
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
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </>
  );
}
