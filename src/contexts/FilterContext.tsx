import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { FilterState, TimeEntry, AIInsight } from '../types/analytics';
import { supabase } from '../lib/supabase';

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
  aiInsights: AIInsight[];
  loading: boolean;
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

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const loadEntries = async (activeFilters: FilterState) => {
    setLoading(true);

    const start = formatDate(activeFilters.dateRange.start);
    const end = formatDate(activeFilters.dateRange.end);
    const batchSize = 1000;
    let from = 0;
    let allEntries: TimeEntry[] = [];
    let shouldContinue = true;

    while (shouldContinue) {
      let query = supabase
        .from<TimeEntry>('time_entries')
        .select('*', { count: 'exact' })
        .gte('work_date', start)
        .lte('work_date', end)
        .order('work_date', { ascending: true })
        .range(from, from + batchSize - 1);

      if (activeFilters.clients.length > 0) {
        query = query.in('client_name', activeFilters.clients);
      }
      if (activeFilters.projects.length > 0) {
        query = query.in('project_name', activeFilters.projects);
      }
      if (activeFilters.sectors.length > 0) {
        query = query.in('sector', activeFilters.sectors);
      }
      if (activeFilters.areas.length > 0) {
        query = query.in('project_area', activeFilters.areas);
      }
      if (activeFilters.users.length > 0) {
        query = query.in('user_name', activeFilters.users);
      }
      if (activeFilters.statuses.length > 0) {
        query = query.in('status', activeFilters.statuses);
      }
      if (activeFilters.practices.length > 0) {
        query = query.in('practice_area', activeFilters.practices);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error loading time entries:', error.message);
        setFilteredEntries([]);
        setLoading(false);
        return;
      }

      const entries = (data ?? []).map(entry => ({
        ...entry,
        minutes: Number(entry.minutes),
        hourly_rate:
          entry.hourly_rate !== null && entry.hourly_rate !== undefined
            ? Number(entry.hourly_rate)
            : undefined,
        total:
          entry.total !== null && entry.total !== undefined ? Number(entry.total) : undefined,
        work_date: String(entry.work_date),
        created_at: String(entry.created_at)
      }));

      allEntries = [...allEntries, ...entries];
      shouldContinue = entries.length === batchSize;
      from += batchSize;
    }

    setFilteredEntries(allEntries);
    setLoading(false);
  };

  const loadAIInsights = async () => {
    const { data, error } = await supabase
      .from<AIInsight>('ai_insights')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Supabase error loading AI insights:', error.message);
      setAIInsights([]);
      return;
    }

    setAIInsights(data ?? []);
  };

  useEffect(() => {
    loadEntries(filters);
  }, [filters]);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const availableOptions = useMemo(() => {
    const clients = new Set<string>();
    const projects = new Set<string>();
    const sectors = new Set<string>();
    const areas = new Set<string>();
    const users = new Set<string>();
    const statuses = new Set<string>();
    const practices = new Set<string>();

    filteredEntries.forEach(entry => {
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
  }, [filteredEntries]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        filteredEntries,
        availableOptions,
        aiInsights,
        loading
      }}
    >
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
