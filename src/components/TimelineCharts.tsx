import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useFilters } from '../contexts/FilterContext';

export function TimelineCharts() {
  const { filteredEntries } = useFilters();

  const chartData = useMemo(() => {
    const dailyData = new Map<
      string,
      {
        hours: number;
        cost: number;
      }
    >();

    // evitar duplicados accidentales
    const processedIds = new Set();

    filteredEntries.forEach(entry => {
      // evitar filas duplicadas
      if (entry.id && processedIds.has(entry.id)) {
        return;
      }

      if (entry.id) {
        processedIds.add(entry.id);
      }

      // normalizar fecha
      // evita bugs timezone y formatos distintos
      const date = entry.work_date?.split('T')[0];

      if (!date) return;

      const existing = dailyData.get(date) || {
        hours: 0,
        cost: 0
      };

      const minutes = Number(entry.minutes || 0);

      dailyData.set(date, {
        hours: existing.hours + (minutes / 60),

        // usar total ya calculado
        cost: existing.cost + Number(entry.total || 0)
      });
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => {
        // formateo manual SIN new Date()
        const [year, month, day] = date.split('-');

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];

        return {
          date,

          displayDate: `${monthNames[Number(month) - 1]} ${day}`,

          hours: Number(data.hours.toFixed(2)),

          cost: Number(data.cost.toFixed(2))
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

  }, [filteredEntries]);

  const minChartWidth = Math.max(760, chartData.length * 56);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* HORAS */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Horas por Día
        </h3>

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

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

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
                  formatter={(value: number) => [
                    `${value.toFixed(1)} hrs`,
                    'Horas'
                  ]}
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

      {/* COSTOS */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">

        <h3 className="text-lg font-semibold text-white mb-4">
          Costos por Día
        </h3>

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

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

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
                  formatter={(value: number) => [
                    `$${value.toFixed(0)}`,
                    'Costo'
                  ]}
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