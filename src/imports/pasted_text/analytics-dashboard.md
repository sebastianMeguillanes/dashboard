Quiero que desarrolles un dashboard analítico moderno en React para visualización de productividad, costos y métricas operativas de una empresa de servicios profesionales (tipo firma legal/consultoría).

Stack Tecnológico

Frontend:

React + TypeScript
Vite
TailwindCSS
Shadcn/ui
Recharts o ECharts para visualizaciones
React Query para manejo de datos
Zustand o Context API para filtros globales
Framer Motion para animaciones suaves

Backend/Data Source:

Supabase como backend principal
PostgreSQL
API REST y consultas directas a Supabase
RLS activado
Materialized Views para métricas agregadas

Autenticación:

Supabase Auth
Roles:
admin
analytics
viewer
Contexto del negocio

La empresa recibe archivos Excel con:

horas trabajadas,
tareas,
proyectos,
clientes,
costos por hora,
áreas de práctica,
sectores,
colaboradores.

Los archivos se procesan automáticamente y se almacenan en Supabase.

El objetivo del dashboard es que gerencia pueda:

entender productividad,
costos,
carga laboral,
desempeño de proyectos,
tendencias,
y anomalías operativas.
Base de datos principal

Tabla principal:
time_entries

Campos importantes:

user_id
user_name
client_name
project_name
project_area
practice_area
sector
minutes
hourly_rate
total
work_date
concept
status

Vista materializada:
project_metrics

Tabla IA:
ai_insights

Requerimientos IMPORTANTES

NO quiero un dashboard genérico.

Quiero una experiencia tipo:

Power BI
Linear
Stripe Analytics
Notion Analytics
Retool moderno

Diseño:

minimalista
ejecutivo
oscuro
moderno
responsive
profesional
Problemas actuales que debes evitar

Los gráficos actuales:

no coinciden con Power BI,
generan agregaciones incorrectas,
mezclan métricas incompatibles,
muestran datos engañosos,
tienen visualizaciones redundantes.

Debes validar cuidadosamente:

agrupaciones,
sumatorias,
filtros,
conversión minutos → horas,
timezone,
duplicados,
cálculos de costo.
Estructura del dashboard

La pantalla inicial NO debe mostrar históricos primero.

Debe enfocarse en:

MES ACTUAL

Primero quiero:

KPIs del mes actual
Horas del mes actual
Costos del mes actual
Proyectos activos
Colaboradores con mayor carga
Tendencias semanales
Alertas automáticas

Luego:

comparativos históricos,
tendencias,
análisis avanzados.
Filtros globales dinámicos

El dashboard debe tener filtros globales sincronizados:

rango de fechas
cliente
proyecto
sector
área
colaborador
estado
práctica

Los filtros deben afectar TODOS los gráficos dinámicamente.

Gráficos que necesito
1. KPIs ejecutivos

Cards modernas con:

Horas totales
Costos totales
Promedio por colaborador
Proyecto más costoso
Cliente principal
Rentabilidad estimada
Variación vs período anterior

Mostrar:

tendencia %
sparkline
comparación semanal/mensual
2. Timeline operativo del mes actual

NO mezclar horas y costos en el mismo eje.

Quiero:

gráfico principal de horas por día
gráfico secundario separado de costos por día

Motivo:
evitar distorsión visual y falsas correlaciones.

3. Heatmap de carga laboral

Heatmap:

eje X → días
eje Y → colaboradores
intensidad → horas trabajadas

Objetivo:
detectar sobrecarga y distribución desigual.

4. Top proyectos

Bar chart horizontal:

proyectos con más horas
proyectos con mayor costo

Con:

filtros dinámicos
tooltips avanzados
drill-down
5. Distribución por cliente y sector

Treemap o Sunburst:

cliente
sector
área

Objetivo:
entender concentración operativa.

6. Tendencia acumulada del mes

Area chart acumulado:

horas acumuladas
costo acumulado

Comparado contra:

promedio esperado
tendencia proyectada.
7. Burn Rate financiero

Line/Area chart:

evolución de costos
proyección fin de mes
desviación presupuestaria
8. Anomalías e insights IA

Consumir tabla:
ai_insights

Mostrar:

alertas
anomalías
patrones detectados
insights generados automáticamente

Diseño tipo:

cards inteligentes
prioridad
severidad
tags
9. Distribución de trabajo

Stacked bar chart:

horas por área
horas por práctica
horas por sector
10. Productividad por colaborador

Scatter plot:

X = horas
Y = costo
tamaño = proyectos atendidos

Objetivo:
detectar:

sobrecarga,
baja eficiencia,
colaboradores clave.
11. Calendario operativo

Vista calendario:

carga diaria
intensidad
proyectos activos
picos de trabajo
12. Comparativos históricos

Solo después del overview actual:

mes vs mes
trimestre
tendencia anual
crecimiento
eficiencia
UX/UI esperado

Quiero:

animaciones suaves
skeleton loading
dark mode elegante
responsive real
diseño enterprise
componentes reutilizables
arquitectura modular
performance optimizada
Arquitectura frontend

Quiero estructura modular:

components/
charts/
hooks/
services/
lib/
pages/
store/
types/

Separar:

lógica de datos,
visualización,
estado global,
filtros,
analytics.
Integración Supabase

Usar:

queries optimizadas
paginación
cache
materialized views
React Query
realtime opcional

Evitar:

traer toda la tabla completa,
cálculos pesados en frontend,
múltiples requests innecesarios.
Objetivo final

Quiero un dashboard analítico serio, consistente y comparable con Power BI, enfocado en:

insights reales,
decisiones gerenciales,
productividad,
costos,