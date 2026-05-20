import { useEffect } from 'react';
import { FilterProvider } from '../contexts/FilterContext';
import { useAuth } from '../contexts/AuthContext';
import { FilterPanel } from '../components/FilterPanel';
import { KPICards } from '../components/KPICards';
import { TimelineCharts } from '../components/TimelineCharts';
import { WorkloadHeatmap } from '../components/WorkloadHeatmap';
import { TopProjects } from '../components/TopProjects';
import { ClientSectorTreemap } from '../components/ClientSectorTreemap';
import { CumulativeTrend } from '../components/CumulativeTrend';
import { AIInsights } from '../components/AIInsights';
import { ProductivityScatter } from '../components/ProductivityScatter';
import { WorkDistribution } from '../components/WorkDistribution';
import { BarChart3, TrendingUp } from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import AuthCallback from '../components/AuthCallback.tsx';

export default function App() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <span className="text-lg">Cargando sesión...</span>
      </div>
    );
  }

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const isOAuthCallback = pathname === '/callback' || hash.includes('access_token=');

  if (isOAuthCallback) {
    return <AuthCallback />;
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (user && role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-10 text-center max-w-xl w-full">
          <h1 className="text-2xl font-semibold text-white mb-3">Acceso insuficiente</h1>
          <p className="text-gray-400 mb-6">
            Tu usuario está autenticado, pero debe tener rol <code className="text-white">admin</code>.
          </p>
          <p className="text-sm text-gray-500">
            Solicita al administrador que agregue tu correo con el rol correcto en la tabla <code className="text-white">user_roles</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-950">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-400">Productividad y Métricas Operativas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Mes Actual</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
          <FilterPanel />

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">KPIs Ejecutivos</h2>
            <KPICards />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Timeline Operativo</h2>
            <TimelineCharts />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WorkloadHeatmap />
            </div>
            <div>
              <AIInsights />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Proyectos Principales</h2>
            <TopProjects />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientSectorTreemap />
            <ProductivityScatter />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Análisis Financiero</h2>
            <CumulativeTrend />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Distribución de Trabajo</h2>
            <WorkDistribution />
          </section>
        </main>

        <footer className="bg-gray-900 border-t border-gray-800 mt-12">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <p className="text-sm text-gray-500 text-center">
              Dashboard Analítico · Powered by React & Recharts · {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </FilterProvider>
  );
}