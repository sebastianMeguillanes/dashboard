import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { format } from 'date-fns';

export function CumulativeTrend() {
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

    const sorted = Array.from(dailyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    let cumulativeHours = 0;
    let cumulativeCost = 0;

    return sorted.map(([date, data], idx) => {
      cumulativeHours += data.hours;
      cumulativeCost += data.cost;

      const avgDaily = cumulativeHours / (idx + 1);
      const projectedHours = avgDaily * sorted.length;

      return {
        date,
        displayDate: format(new Date(date), 'MMM dd'),
        cumHours: parseFloat(cumulativeHours.toFixed(1)),
        cumCost: parseFloat(cumulativeCost.toFixed(0)),
        projected: parseFloat(projectedHours.toFixed(1))
      };
    });
  }, [filteredEntries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tendencia Acumulada de Horas</h3>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorCumHours" x1="0" y1="0" x2="0" y2="1">
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
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Area
              type="monotone"
              dataKey="cumHours"
              name="Acumulado"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCumHours)"
            />
            <Line
              type="monotone"
              dataKey="projected"
              name="Proyección"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Burn Rate Financiero</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCumCost" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: number) => [`$${value.toFixed(0)}`, 'Costo Acumulado']}
            />
            <Area
              type="monotone"
              dataKey="cumCost"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorCumCost)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
