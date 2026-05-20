import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FilterState, TimeEntry } from '../types/analytics';
import { mockTimeEntries } from '../lib/mockData';

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  filteredEntries: TimeEntry[];
  availableOptions: {
    clients: string[];
    projects: string[];
    sectors: string[];
    areas: string[];
    users: string[];
    statuses: string[];
    practices: string[];
  };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  dateRange: {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  },
  clients: [],
  projects: [],
  sectors: [],
  areas: [],
  users: [],
  statuses: [],
  practices: []
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const filteredEntries = useMemo(() => {
    return mockTimeEntries.filter(entry => {
      const entryDate = new Date(entry.work_date);

      if (entryDate < filters.dateRange.start || entryDate > filters.dateRange.end) {
        return false;
      }

      if (filters.clients.length > 0 && !filters.clients.includes(entry.client_name || '')) {
        return false;
      }

      if (filters.projects.length > 0 && !filters.projects.includes(entry.project_name || '')) {
        return false;
      }

      if (filters.sectors.length > 0 && !filters.sectors.includes(entry.sector || '')) {
        return false;
      }

      if (filters.areas.length > 0 && !filters.areas.includes(entry.project_area || '')) {
        return false;
      }

      if (filters.users.length > 0 && !filters.users.includes(entry.user_name)) {
        return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(entry.status || '')) {
        return false;
      }

      if (filters.practices.length > 0 && !filters.practices.includes(entry.practice_area || '')) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const availableOptions = useMemo(() => {
    const clients = new Set<string>();
    const projects = new Set<string>();
    const sectors = new Set<string>();
    const areas = new Set<string>();
    const users = new Set<string>();
    const statuses = new Set<string>();
    const practices = new Set<string>();

    mockTimeEntries.forEach(entry => {
      if (entry.client_name) clients.add(entry.client_name);
      if (entry.project_name) projects.add(entry.project_name);
      if (entry.sector) sectors.add(entry.sector);
      if (entry.project_area) areas.add(entry.project_area);
      if (entry.user_name) users.add(entry.user_name);
      if (entry.status) statuses.add(entry.status);
      if (entry.practice_area) practices.add(entry.practice_area);
    });

    return {
      clients: Array.from(clients).sort(),
      projects: Array.from(projects).sort(),
      sectors: Array.from(sectors).sort(),
      areas: Array.from(areas).sort(),
      users: Array.from(users).sort(),
      statuses: Array.from(statuses).sort(),
      practices: Array.from(practices).sort()
    };
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, filteredEntries, availableOptions }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
