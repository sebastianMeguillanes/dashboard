import { TimeEntry, ProjectMetric, AIInsight } from '../types/analytics';
import { startOfMonth, endOfMonth, eachDayOfInterval, subMonths, format, addDays } from 'date-fns';

const clients = ['Acme Corp', 'TechVision Inc', 'Global Services LLC', 'Enterprise Solutions', 'Innovation Hub'];
const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon', 'Project Zeta'];
const sectors = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Consulting'];
const areas = ['Development', 'Strategy', 'Operations', 'Legal', 'Compliance'];
const practices = ['Software Engineering', 'Legal Advisory', 'Tax Consulting', 'Risk Management', 'M&A'];
const users = ['Ana García', 'Carlos Mendez', 'Laura Torres', 'Miguel Santos', 'Sofia Ramirez', 'Diego Fernandez', 'Maria Lopez', 'Juan Pérez'];
const statuses = ['completed', 'in_progress', 'billed', 'pending'];
const concepts = ['Development', 'Meeting', 'Review', 'Planning', 'Analysis', 'Documentation'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockTimeEntries(months: number = 3): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const endDate = endOfMonth(new Date());
  const startDate = startOfMonth(subMonths(endDate, months - 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  let id = 1;

  days.forEach(day => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    if (isWeekend && Math.random() > 0.3) return;

    const entriesPerDay = randomInt(8, 25);

    for (let i = 0; i < entriesPerDay; i++) {
      const user = randomItem(users);
      const client = randomItem(clients);
      const project = randomItem(projects);
      const minutes = randomInt(30, 480);
      const hourlyRate = randomInt(80, 250);
      const total = (minutes / 60) * hourlyRate;

      entries.push({
        id: id++,
        user_id: `user_${users.indexOf(user) + 1}`,
        user_name: user,
        user_category: randomItem(['Senior', 'Mid', 'Junior']),
        client_id: clients.indexOf(client) + 1,
        client_name: client,
        project_id: `proj_${projects.indexOf(project) + 1}`,
        sector: randomItem(sectors),
        project_name: project,
        project_area: randomItem(areas),
        practice_area: randomItem(practices),
        reported_time: `${(minutes / 60).toFixed(2)}h`,
        minutes,
        work_date: format(day, 'yyyy-MM-dd'),
        concept: randomItem(concepts),
        hourly_rate: hourlyRate,
        total: parseFloat(total.toFixed(2)),
        status: randomItem(statuses),
        created_at: day.toISOString(),
        source_file: `import_${format(day, 'yyyyMM')}.xlsx`
      });
    }
  });

  return entries;
}

export function generateProjectMetrics(entries: TimeEntry[]): ProjectMetric[] {
  const projectMap = new Map<string, {
    entries: TimeEntry[];
    users: Set<string>;
  }>();

  entries.forEach(entry => {
    const key = entry.project_name || 'Unknown';
    if (!projectMap.has(key)) {
      projectMap.set(key, { entries: [], users: new Set() });
    }
    const project = projectMap.get(key)!;
    project.entries.push(entry);
    project.users.add(entry.user_id);
  });

  const metrics: ProjectMetric[] = [];

  projectMap.forEach((data, projectName) => {
    const totalMinutes = data.entries.reduce((sum, e) => sum + e.minutes, 0);
    const totalCost = data.entries.reduce((sum, e) => sum + (e.total || 0), 0);
    const dates = data.entries.map(e => e.work_date).sort();

    metrics.push({
      project_id: data.entries[0]?.project_id,
      project_name: projectName,
      client_name: data.entries[0]?.client_name,
      sector: data.entries[0]?.sector,
      total_minutes: totalMinutes,
      total_hours: parseFloat((totalMinutes / 60).toFixed(2)),
      total_cost: parseFloat(totalCost.toFixed(2)),
      team_size: data.users.size,
      first_entry: dates[0],
      last_entry: dates[dates.length - 1]
    });
  });

  return metrics.sort((a, b) => b.total_cost - a.total_cost);
}

export function generateAIInsights(): AIInsight[] {
  const currentMonth = format(new Date(), 'yyyy-MM');

  return [
    {
      id: 1,
      period: currentMonth,
      insight: 'Anomalía detectada: Proyecto Alpha muestra 35% más horas de lo esperado esta semana',
      category: 'overload',
      severity: 'high',
      priority: 1,
      source_data: { project: 'Project Alpha', deviation: 0.35 },
      generated_at: new Date().toISOString()
    },
    {
      id: 2,
      period: currentMonth,
      insight: 'Distribución desigual: 3 colaboradores concentran el 60% de la carga del cliente Acme Corp',
      category: 'distribution',
      severity: 'medium',
      priority: 2,
      source_data: { client: 'Acme Corp', concentration: 0.6 },
      generated_at: addDays(new Date(), -1).toISOString()
    },
    {
      id: 3,
      period: currentMonth,
      insight: 'Tendencia positiva: Eficiencia del sector Finance aumentó 12% vs mes anterior',
      category: 'efficiency',
      severity: 'low',
      priority: 3,
      source_data: { sector: 'Finance', improvement: 0.12 },
      generated_at: addDays(new Date(), -2).toISOString()
    },
    {
      id: 4,
      period: currentMonth,
      insight: 'Alerta de costos: Burn rate actual proyecta 18% sobre presupuesto mensual',
      category: 'budget',
      severity: 'high',
      priority: 1,
      source_data: { overrun: 0.18 },
      generated_at: addDays(new Date(), -3).toISOString()
    },
    {
      id: 5,
      period: currentMonth,
      insight: 'Patrón identificado: Martes y miércoles concentran picos de actividad (45% más horas)',
      category: 'pattern',
      severity: 'low',
      priority: 4,
      source_data: { days: ['Tuesday', 'Wednesday'], increase: 0.45 },
      generated_at: addDays(new Date(), -5).toISOString()
    }
  ];
}

