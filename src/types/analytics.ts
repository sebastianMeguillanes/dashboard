export interface TimeEntry {
  id: number;
  user_id: string;
  user_name: string;
  user_category?: string;
  client_id?: number;
  client_name?: string;
  project_id?: string;
  sector?: string;
  project_name?: string;
  project_area?: string;
  practice_area?: string;
  reported_time?: string;
  minutes: number;
  work_date: string;
  concept?: string;
  hourly_rate?: number;
  total?: number;
  status?: string;
  created_at: string;
  source_file?: string;
}

export interface ProjectMetric {
  project_id?: string;
  project_name?: string;
  client_name?: string;
  sector?: string;
  total_minutes: number;
  total_hours: number;
  total_cost: number;
  team_size: number;
  first_entry: string;
  last_entry: string;
}

export interface AIInsight {
  id: number;
  period?: string;
  insight: string;
  category?: string;
  source_data?: Record<string, any>;
  generated_at: string;
  severity?: 'low' | 'medium' | 'high';
  priority?: number;
}

export interface FilterState {
  dateRange: { start: Date; end: Date };
  clients: string[];
  projects: string[];
  sectors: string[];
  areas: string[];
  users: string[];
  statuses: string[];
  practices: string[];
}

export interface KPIMetrics {
  totalHours: number;
  totalCost: number;
  avgPerUser: number;
  topProject: { name: string; cost: number };
  topClient: { name: string; hours: number };
  profitability: number;
  variation: number;
}
