import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilters } from '../contexts/FilterContext';

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
}

const COLORS = [
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#db2777',
  '#0f766e',
  '#ea580c',
];

const wrapText = (text: string, maxChars: number) => {
  if (!text) return [''];

  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines;
};

export function ClientSectorTreemap() {
  const { filteredEntries } = useFilters();

  const treemapData = useMemo(() => {
    /**
     * sector -> project_area -> minutes
     */
    const sectorProjectMap = new Map<
      string,
      Map<string, number>
    >();

    filteredEntries.forEach(entry => {
      const sector =
        entry.sector || 'Sin Sector';

      const area =
        entry.project_area ||
        'Sin Área';

      if (!sectorProjectMap.has(sector)) {
        sectorProjectMap.set(
          sector,
          new Map()
        );
      }

      const areaMap =
        sectorProjectMap.get(sector)!;

      areaMap.set(
        area,
        (areaMap.get(area) || 0) +
          entry.minutes
      );
    });

    /**
     * TOP 5 sectores
     */
    const topSectors = Array.from(sectorProjectMap.entries())
      .map(([sector, areaMap]) => {
        const topAreas = Array.from(areaMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const totalMinutes = topAreas.reduce((sum, [, minutes]) => sum + minutes, 0);

        return {
          name: sector,
          size: totalMinutes,
          children: topAreas.map(([area, minutes]) => ({
            name: area,
            size: minutes,
          })),
        };
      })
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    return [{ name: 'Sectores', children: topSectors }];
  }, [filteredEntries]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const node = payload[0]?.payload || payload[0];
    const name = node?.name ?? 'Sin dato';
    const value = node?.size ?? payload[0]?.value ?? 0;
    const hours = (value / 60).toFixed(1);
    const depth = node?.depth ?? node?.payload?.depth ?? 0;
    const label = depth === 2 ? 'Área' : depth === 1 ? 'Sector' : 'Elemento';

    return (
      <div style={{ padding: 12, background: '#c1c7d6', border: '1px solid #334155', borderRadius: 12, color: '#0f172a', minWidth: 150, fontWeight: 600 }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#334155' }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 6, lineHeight: 1.2, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 13, marginTop: 8, color: '#111827' }}>{hours} hrs trabajadas</div>
      </div>
    );
  };

  const CustomizedContent = (props: any) => {
    const {
      x,
      y,
      width,
      height,
      name,
      depth,
      index,
      size,
    } = props;

    if (!width || !height || width < 80 || height < 60) {
      return null;
    }

    const safeName = typeof name === 'string' ? name : '';
    const safeSize = typeof size === 'number' ? size : 0;
    const totalHours = (safeSize / 60).toFixed(1);

    const color = COLORS[(index || 0) % COLORS.length];
    const isSector = depth === 1;
    const isArea = depth === 2;

    const labelChars = Math.max(14, Math.floor(width / 10));
    const lines = wrapText(safeName, labelChars);
    const headerLines = isSector ? lines.slice(0, 3) : [];
    const labelFontSize = isSector ? Math.min(28, Math.max(16, Math.floor(width / Math.max(8, Math.min(24, safeName.length))))) : Math.min(12, Math.max(10, Math.floor(width / 10)));
    const overlayHeight = isSector ? Math.min(140, Math.max(72, headerLines.length * (labelFontSize + 4) + 28)) : 0;

    return (
      <g>
        {/* Block background */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={10}
          ry={10}
          fill={color}
          stroke="#0f172a"
          strokeWidth={isSector ? 3 : 1}
          opacity={isSector ? 0.96 : 0.88}
        />

        {isSector && (
          <>
            <rect
              x={x}
              y={y}
              width={width}
              height={overlayHeight}
              rx={10}
              fill="rgba(0,0,0,0.24)"
            />

            <text
              x={x + 18}
              y={y + 24}
              fill="#ffffff"
              fontSize={labelFontSize}
              fontWeight={900}
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.45)' }}
            >
              {headerLines.map((line, idx) => (
                <tspan key={`${line}-${idx}`} x={x + 18} dy={idx === 0 ? 0 : labelFontSize + 4}>
                  {line}
                </tspan>
              ))}
              <tspan x={x + 18} dy={labelFontSize + 10} fontSize={Math.max(12, labelFontSize - 8)} fontWeight={700} fill="#d1d5db">
                {totalHours} hrs
              </tspan>
            </text>
          </>
        )}

        {isArea && width > 120 && height > 40 && (
          <text
            x={x + 10}
            y={y + 16}
            fill="#ffffff"
            fontSize={12}
            fontWeight={700}
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}
          >
            {safeName}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-white">
          Distribución por Sector y Área
        </h3>

        <span className="text-xs text-gray-400">
          Top 5 sectores · Top 5 áreas por sector
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Los bloques más grandes representan mayor carga horaria acumulada.
      </p>

      <ResponsiveContainer
        width="100%"
        height={560}
      >
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#1f2937"
          content={
            <CustomizedContent />
          }
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}