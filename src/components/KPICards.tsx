import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, DollarSign, Users, Briefcase, Target } from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: number;
  icon: React.ReactNode;
  sparkline?: number[];
}

function KPICard({ title, value, subtitle, trend, icon, sparkline }: KPICardProps) {
  const trendColor = trend && trend > 0 ? 'text-green-400' : trend && trend < 0 ? 'text-red-400' : 'text-gray-400';
  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gray-800 rounded-lg">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {sparkline && sparkline.length > 0 && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {sparkline.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-blue-500/20 rounded-sm"
              style={{ height: `${(val / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function KPICards() {
  const { filteredEntries } = useFilters();

  const metrics = useMemo(() => {
    const totalHours = filteredEntries.reduce((sum, e) => sum + e.minutes, 0) / 60;
    const totalCost = filteredEntries.reduce((sum, e) => sum + (e.total || 0), 0);
    const uniqueUsers = new Set(filteredEntries.map(e => e.user_id)).size;
    const avgPerUser = uniqueUsers > 0 ? totalHours / uniqueUsers : 0;

    const projectCosts = new Map<string, number>();
    filteredEntries.forEach(e => {
      const proj = e.project_name || 'Unknown';
      projectCosts.set(proj, (projectCosts.get(proj) || 0) + (e.total || 0));
    });
    const topProject = Array.from(projectCosts.entries()).sort((a, b) => b[1] - a[1])[0];

    const clientHours = new Map<string, number>();
    filteredEntries.forEach(e => {
      const client = e.client_name || 'Unknown';
      clientHours.set(client, (clientHours.get(client) || 0) + e.minutes);
    });
    const topClient = Array.from(clientHours.entries()).sort((a, b) => b[1] - a[1])[0];

    const sortedEntries = [...filteredEntries].sort((a, b) => a.work_date.localeCompare(b.work_date));
    const midpoint = Math.floor(sortedEntries.length / 2);
    const firstHalfHours = sortedEntries.slice(0, midpoint).reduce((sum, e) => sum + e.minutes, 0) / 60;
    const secondHalfHours = sortedEntries.slice(midpoint).reduce((sum, e) => sum + e.minutes, 0) / 60;
    const variation = firstHalfHours > 0 ? ((secondHalfHours - firstHalfHours) / firstHalfHours) * 100 : 0;

    const avgRate = totalHours > 0 ? totalCost / totalHours : 0;
    const estimatedRevenue = totalCost * 1.4;
    const profitability = ((estimatedRevenue - totalCost) / estimatedRevenue) * 100;

    const dailyHours: number[] = [];
    const dateMap = new Map<string, number>();
    filteredEntries.forEach(e => {
      dateMap.set(e.work_date, (dateMap.get(e.work_date) || 0) + e.minutes / 60);
    });
    const sortedDates = Array.from(dateMap.keys()).sort();
    sortedDates.slice(-7).forEach(date => {
      dailyHours.push(dateMap.get(date) || 0);
    });

    return {
      totalHours,
      totalCost,
      avgPerUser,
      topProject,
      topClient,
      variation,
      profitability,
      uniqueUsers,
      dailyHours
    };
  }, [filteredEntries]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Horas Totales"
        value={metrics.totalHours.toFixed(0)}
        subtitle="Mes actual"
        trend={metrics.variation}
        icon={<Clock className="w-5 h-5 text-blue-400" />}
        sparkline={metrics.dailyHours}
      />
      <KPICard
        title="Costos Totales"
        value={`$${(metrics.totalCost / 1000).toFixed(1)}k`}
        subtitle="Inversión del período"
        trend={metrics.variation * 0.8}
        icon={<DollarSign className="w-5 h-5 text-green-400" />}
      />
      <KPICard
        title="Promedio por Colaborador"
        value={`${metrics.avgPerUser.toFixed(1)}h`}
        subtitle={`${metrics.uniqueUsers} colaboradores activos`}
        icon={<Users className="w-5 h-5 text-purple-400" />}
      />
      <KPICard
        title="Proyecto Principal"
        value={metrics.topProject ? `$${(metrics.topProject[1] / 1000).toFixed(1)}k` : 'N/A'}
        subtitle={metrics.topProject ? metrics.topProject[0] : 'Sin datos'}
        icon={<Briefcase className="w-5 h-5 text-orange-400" />}
      />
      <KPICard
        title="Cliente Principal"
        value={metrics.topClient ? `${(metrics.topClient[1] / 60).toFixed(0)}h` : 'N/A'}
        subtitle={metrics.topClient ? metrics.topClient[0] : 'Sin datos'}
        icon={<Target className="w-5 h-10 text-cyan-400" />}
      />
      {/* <KPICard
        title="Rentabilidad Estimada"
        value={`${metrics.profitability.toFixed(1)}%`}
        subtitle="Margen proyectado"
        trend={metrics.profitability - 25}
        icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
      /> */}
    </div>
  );
}
