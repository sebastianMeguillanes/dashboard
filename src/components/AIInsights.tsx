import { AlertTriangle, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { mockAIInsights } from '../lib/mockData';

const severityConfig = {
  high: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  medium: {
    icon: AlertCircle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  low: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  }
};

const categoryLabels: Record<string, string> = {
  overload: 'Sobrecarga',
  distribution: 'Distribución',
  efficiency: 'Eficiencia',
  budget: 'Presupuesto',
  pattern: 'Patrón'
};

export function AIInsights() {
  const insights = mockAIInsights.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Insights y Anomalías</h3>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">Powered by AI</span>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map(insight => {
          const severity = insight.severity || 'low';
          const config = severityConfig[severity];
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className={`${config.bg} ${config.border} border rounded-lg p-4 hover:scale-[1.01] transition-transform cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {categoryLabels[insight.category || ''] || insight.category}
                    </span>
                    {insight.priority && insight.priority <= 2 && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        Prioridad Alta
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white">{insight.insight}</p>
                  {insight.period && (
                    <p className="text-xs text-gray-500 mt-1">Período: {insight.period}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
