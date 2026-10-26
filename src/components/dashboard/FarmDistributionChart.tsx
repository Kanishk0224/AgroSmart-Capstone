import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DashboardStats } from '../../types';

interface FarmDistributionChartProps {
  stats?: DashboardStats | null;
}

const COLORS = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export const FarmDistributionChart: React.FC<FarmDistributionChartProps> = ({ stats }) => {
  const distribution = stats?.soilTypeDistribution || [];
  const data = distribution.length
    ? distribution.map((item) => ({
        name: item.type,
        value: item.count,
      }))
    : [{ name: 'Loamy', value: 1 }];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Soil Classification Breakdown</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribution of registered farm plots by classified soil texture
        </p>
      </div>

      <div className="h-52 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        {distribution.slice(0, 4).map((item, index) => (
          <div key={item.type} className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="font-medium capitalize">{item.type.toLowerCase()} Soil</span>
            </div>
            <span className="font-semibold text-slate-800">{item.count} plots</span>
          </div>
        ))}
      </div>
    </div>
  );
};
