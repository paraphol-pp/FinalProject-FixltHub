"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { stringToColor } from "@/lib/utils";

interface CategoryChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const CategoryChart = ({ data }: CategoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        No data to display
      </div>
    );
  }

  // Check if recharts is installed
  if (!PieChart) {
    return (
      <div className="flex items-center justify-center h-full text-center text-white/80">
        Please install recharts to view the chart.
        <br />
        <code className="bg-neutral-800 p-2 rounded-md mt-2">
          npm install recharts @types/recharts
        </code>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
          }: any) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={12}
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={stringToColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1f1f1f",
            borderColor: "#444",
            borderRadius: "0.5rem",
          }}
          labelStyle={{ color: "#ccc" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
