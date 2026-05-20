import { useMemo } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { format, parseISO } from 'date-fns';

export function WorkloadHeatmap() {
  const { filteredEntries } = useFilters();

  const heatmapData = useMemo(() => {
    const userDateMap = new Map<string, Map<string, number>>();

    filteredEntries.forEach(entry => {
      if (!userDateMap.has(entry.user_name)) {
        userDateMap.set(entry.user_name, new Map());
      }
      const dateMap = userDateMap.get(entry.user_name)!;
      const hours = (entry.minutes / 60);
      dateMap.set(entry.work_date, (dateMap.get(entry.work_date) || 0) + hours);
    });

    const allDates = Array.from(new Set(filteredEntries.map(e => e.work_date))).sort();
    const recentDates = allDates.slice(-14);

    const users = Array.from(userDateMap.keys()).sort();

    const maxHours = Math.max(
      ...Array.from(userDateMap.values()).flatMap(dateMap =>
        Array.from(dateMap.values())
      ),
      1
    );

    return {
      users,
      dates: recentDates,
      data: userDateMap,
      maxHours
    };
  }, [filteredEntries]);

  const getIntensityColor = (hours: number) => {
    if (hours === 0) return 'bg-gray-800';
    const intensity = Math.min(hours / heatmapData.maxHours, 1);
    if (intensity < 0.25) return 'bg-blue-500/20';
    if (intensity < 0.5) return 'bg-blue-500/40';
    if (intensity < 0.75) return 'bg-blue-500/60';
    return 'bg-blue-500/80';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Heatmap de Carga Laboral</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            <div className="w-32 flex-shrink-0">
              <div className="h-8" />
              {heatmapData.users.map(user => (
                <div key={user} className="h-8 flex items-center text-xs text-gray-400 truncate pr-2">
                  {user}
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-1">
                {heatmapData.dates.map(date => (
                  <div key={date} className="flex-1 min-w-12">
                    <div className="h-8 flex items-center justify-center text-xs text-gray-400">
                      {format(parseISO(date), 'dd/MM')}
                    </div>
                    {heatmapData.users.map(user => {
                      const hours = heatmapData.data.get(user)?.get(date) || 0;
                      return (
                        <div
                          key={`${user}-${date}`}
                          className={`h-8 rounded ${getIntensityColor(hours)} border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer`}
                          title={`${user} - ${format(parseISO(date), 'dd/MM/yyyy')}: ${hours.toFixed(1)}h`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-800 rounded" />
              <div className="w-4 h-4 bg-blue-500/20 rounded" />
              <div className="w-4 h-4 bg-blue-500/40 rounded" />
              <div className="w-4 h-4 bg-blue-500/60 rounded" />
              <div className="w-4 h-4 bg-blue-500/80 rounded" />
            </div>
            <span>Más</span>
          </div>
        </div>
      </div>
    </div>
  );
}
