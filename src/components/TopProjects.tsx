import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

export function TopProjects() {
  const { filteredEntries } = useFilters();

  const projectData = useMemo(() => {
    const projectMap = new Map<string, { hours: number; cost: number }>();

    filteredEntries.forEach(entry => {
      const project = entry.project_name || 'Unknown';
      const existing = projectMap.get(project) || { hours: 0, cost: 0 };
      projectMap.set(project, {
        hours: existing.hours + (entry.minutes / 60),
        cost: existing.cost + (entry.total || 0)
      });
    });

    return Array.from(projectMap.entries())
      .map(([name, data]) => ({
        name,
        hours: parseFloat(data.hours.toFixed(1)),
        cost: parseFloat(data.cost.toFixed(0))
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);
  }, [filteredEntries]);

  const costData = useMemo(() => {
    return [...projectData].sort((a, b) => b.cost - a.cost);
  }, [projectData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Proyectos por Horas</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={projectData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={11}
              width={120}
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
            <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Proyectos por Costo</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={costData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              fontSize={11}
              width={120}
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
            <Bar dataKey="cost" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
