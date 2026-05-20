import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function ClientSectorTreemap() {
  const { filteredEntries } = useFilters();

  const treemapData = useMemo(() => {
    const clientSectorMap = new Map<string, Map<string, number>>();

    filteredEntries.forEach(entry => {
      const client = entry.client_name || 'Unknown';
      const sector = entry.sector || 'Other';

      if (!clientSectorMap.has(client)) {
        clientSectorMap.set(client, new Map());
      }
      const sectorMap = clientSectorMap.get(client)!;
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + entry.minutes);
    });

    const children: TreemapData[] = Array.from(clientSectorMap.entries())
      .map(([client, sectorMap]) => {
        const totalMinutes = Array.from(sectorMap.values()).reduce((sum, m) => sum + m, 0);
        return {
          name: client,
          size: totalMinutes,
          children: Array.from(sectorMap.entries()).map(([sector, minutes]) => ({
            name: `${sector}`,
            size: minutes
          }))
        };
      })
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    return [{ name: 'Distribución', children }];
  }, [filteredEntries]);

  const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, depth, index } = props;

    if (width < 40 || height < 40) return null;

    const color = COLORS[index % COLORS.length];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#1f2937',
            strokeWidth: 2,
            opacity: depth === 1 ? 0.8 : 0.5
          }}
        />
        {width > 60 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={depth === 1 ? 14 : 11}
            fontWeight={depth === 1 ? 'bold' : 'normal'}
          >
            {name && name.length > 15 ? `${name.substring(0, 15)}...` : name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Distribución por Cliente y Sector</h3>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={treemapData}
          dataKey="size"
          stroke="#1f2937"
          fill="#3b82f6"
          content={<CustomizedContent />}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`${(value / 60).toFixed(1)} hrs`, 'Tiempo']}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
