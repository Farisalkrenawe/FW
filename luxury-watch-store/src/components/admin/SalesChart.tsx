"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 140 },
  { month: 'Mar', sales: 48000, orders: 130 },
  { month: 'Apr', sales: 61000, orders: 165 },
  { month: 'May', sales: 55000, orders: 145 },
  { month: 'Jun', sales: 67000, orders: 180 },
  { month: 'Jul', sales: 71000, orders: 190 },
  { month: 'Aug', sales: 69000, orders: 185 },
  { month: 'Sep', sales: 76000, orders: 205 },
  { month: 'Oct', sales: 82000, orders: 220 },
  { month: 'Nov', sales: 88000, orders: 235 },
  { month: 'Dec', sales: 95000, orders: 250 }
];

export function SalesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="month" 
            className="text-gray-600 text-sm"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-gray-600 text-sm"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'sales' ? `$${value.toLocaleString()}` : value,
              name === 'sales' ? 'Sales' : 'Orders'
            ]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#d4af37" 
            strokeWidth={3}
            dot={{ fill: '#d4af37', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#d4af37', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}