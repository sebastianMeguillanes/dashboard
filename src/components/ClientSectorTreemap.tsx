import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const truncateLabel = (label: string, maxLength = 14) =>
  label && label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;

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

  // No renderizar bloques demasiado pequeños
  if (!width || !height || width < 90 || height < 32) return null;

  const safeName: string = typeof name === 'string' ? name : String(name ?? '');
  const safeIndex = typeof index === 'number' ? index : 0;

  const color = COLORS[safeIndex % COLORS.length];

  // Ajustes dinámicos
  const fontSize = depth === 1 ? 13 : 11;
  const padding = 8;

  // Calcular caracteres según ancho real
  const approxChars = Math.max(
    8,
    Math.floor((width - padding * 2) / (fontSize * 0.6))
  );

  const label = truncateLabel(safeName, approxChars) || '';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        style={{
          fill: color,
          stroke: '#111827',
          strokeWidth: 1.5,
          opacity: depth === 1 ? 0.9 : 0.75
        }}
      />

      {/* Fondo oscuro para mejorar lectura */}
      <rect
        x={x + 4}
        y={y + 4}
        width={Math.min(width - 8, label.length * fontSize * 0.65)}
        height={20}
        rx={4}
        fill="rgba(0,0,0,0.35)"
      />

      <text
        x={x + padding}
        y={y + 18}
        fill="#ffffff"
        fontSize={fontSize}
        fontWeight={600}
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {label}
      </text>
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
              backgroundColor: '#cedaeb',
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
