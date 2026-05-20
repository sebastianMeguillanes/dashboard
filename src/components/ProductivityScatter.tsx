import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

export function ProductivityScatter() {
  const { filteredEntries } = useFilters();

  const scatterData = useMemo(() => {
    const userMap = new Map<string, { hours: number; cost: number; projects: Set<string> }>();

    filteredEntries.forEach(entry => {
      const user = entry.user_name;
      if (!userMap.has(user)) {
        userMap.set(user, { hours: 0, cost: 0, projects: new Set() });
      }
      const userData = userMap.get(user)!;
      userData.hours += entry.minutes / 60;
      userData.cost += entry.total || 0;
      if (entry.project_name) userData.projects.add(entry.project_name);
    });

    return Array.from(userMap.entries()).map(([name, data]) => ({
      name,
      hours: parseFloat(data.hours.toFixed(1)),
      cost: parseFloat(data.cost.toFixed(0)),
      projects: data.projects.size
    }));
  }, [filteredEntries]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Productividad por Colaborador</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="hours"
            name="Horas"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            label={{ value: 'Horas Trabajadas', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
          />
          <YAxis
            type="number"
            dataKey="cost"
            name="Costo"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            label={{ value: 'Costo Generado ($)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <ZAxis type="number" dataKey="projects" range={[100, 1000]} name="Proyectos" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">{data.name}</p>
                  <p className="text-sm text-gray-300">Horas: {data.hours}</p>
                  <p className="text-sm text-gray-300">Costo: ${data.cost}</p>
                  <p className="text-sm text-gray-300">Proyectos: {data.projects}</p>
                </div>
              );
            }}
          />
          <Scatter
            name="Colaboradores"
            data={scatterData}
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
