import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SoilTest, DashboardStats } from '../../types';

interface SoilHealthChartProps {
  soilTests?: SoilTest[];
  stats?: DashboardStats | null;
}

export const SoilHealthChart: React.FC<SoilHealthChartProps> = ({ soilTests }) => {
  const tests = Array.isArray(soilTests) ? soilTests : [];

  if (tests.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-slate-500 font-medium text-sm">No soil test data recorded yet.</p>
        <p className="text-slate-400 text-xs mt-1">
          Log a soil test from your farm plots to generate nutrient telemetry.
        </p>
      </div>
    );
  }

  const data = tests
    .slice(0, 6)
    .reverse()
    .map((test, index) => ({
      name: test.testDate || `Test #${index + 1}`,
      Nitrogen: test.nitrogenLevel,
      Phosphorus: test.phosphorusLevel,
      Potassium: test.potassiumLevel,
      pH: test.phLevel,
    }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Macronutrient Profile (N-P-K Telemetry)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Nitrogen (N), Phosphorus (P), and Potassium (K) concentrations across recent tests
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-700"></span> Nitrogen (kg/ha)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-600"></span> Phosphorus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-600"></span> Potassium
          </span>
        </div>
      </div>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="Nitrogen" fill="#047857" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Phosphorus" fill="#d97706" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Potassium" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Scientific reference: Normal ranges N (280–560), P (15–30), K (120–280 kg/ha)</span>
        <span className="font-semibold text-emerald-800">Direct Lab &amp; Sensor Calibration</span>
      </div>
    </div>
  );
};
