import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { format } from 'date-fns';

export function TimelineCharts() {
  const { filteredEntries } = useFilters();

  const chartData = useMemo(() => {
    const dailyData = new Map<string, { hours: number; cost: number }>();

    filteredEntries.forEach(entry => {
      const date = entry.work_date;
      const existing = dailyData.get(date) || { hours: 0, cost: 0 };
      dailyData.set(date, {
        hours: existing.hours + (entry.minutes / 60),
        cost: existing.cost + (entry.total || 0)
      });
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        displayDate: format(new Date(date), 'MMM dd'),
        hours: parseFloat(data.hours.toFixed(1)),
        cost: parseFloat(data.cost.toFixed(0))
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredEntries]);
  const minChartWidth = Math.max(760, chartData.length * 56);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Horas por Día</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <div style={{ minWidth: `${minChartWidth}px` }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="displayDate"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={12}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Horas']}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorHours)"
            />
          </AreaChart>
        </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Costos por Día</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <div style={{ minWidth: `${minChartWidth}px` }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="displayDate"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={12}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`$${value.toFixed(0)}`, 'Costo']}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorCost)"
            />
          </AreaChart>
        </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
