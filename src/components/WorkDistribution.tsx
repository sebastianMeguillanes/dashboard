import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

const truncateLabel = (value: string, maxLength = 18) =>
  value && value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

export function WorkDistribution() {
  const { filteredEntries } = useFilters();

  const areaData = useMemo(() => {
    const areaMap = new Map<string, number>();

    filteredEntries.forEach(entry => {
      const area = entry.project_area || 'Other';
      areaMap.set(area, (areaMap.get(area) || 0) + (entry.minutes / 60));
    });

    return Array.from(areaMap.entries())
      .map(([name, hours]) => ({
        name,
        hours: parseFloat(hours.toFixed(1))
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [filteredEntries]);

  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, number>();

    filteredEntries.forEach(entry => {
      const sector = entry.sector || 'Other';
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + (entry.minutes / 60));
    });

    return Array.from(sectorMap.entries())
      .map(([name, hours]) => ({
        name,
        hours: parseFloat(hours.toFixed(1))
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [filteredEntries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución por Área</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={areaData} margin={{ left: 24, right: 24, top: 20, bottom: 60 }} barCategoryGap="24%">
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickFormatter={truncateLabel}
              interval={0}
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Horas']}
            />
            <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución por Sector</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sectorData} margin={{ left: 24, right: 24, top: 20, bottom: 60 }} barCategoryGap="24%">
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickFormatter={truncateLabel}
              interval={0}
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Horas']}
            />
            <Bar dataKey="hours" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
