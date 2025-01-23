/* eslint-disable react-hooks/exhaustive-deps */
import { Models } from "appwrite";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateDailyTransactions, generateChartData } from "@/lib/utils";

const MonthlyTransactionChart = ({
  transactions,
  currentMonth,
  title,
  transactionType,
}: {
  transactions: Models.DocumentList<Models.Document>;
  currentMonth: Date;
  title: string;
  transactionType: "Ingreso" | "Gasto";
}) => {
  const dailyTransactions = useMemo(() => {
    return calculateDailyTransactions(transactions, transactionType);
  }, [transactions]);

  const chartData = generateChartData(currentMonth, dailyTransactions);

  const dayNames = ["LU", "MA", "MI", "JU", "VI", "SÁ", "DO"];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="w-auto mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {title} -{" "}
            {currentMonth.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 relative overflow-auto flex md:justify-center">
          <ChartContainer
            config={{
              LUN: { label: "Lunes", color: "rgb(239 68 68)" },
              MAR: { label: "Martes", color: "rgb(34 197 94)" },
              MIÉ: { label: "Miércoles", color: "rgb(59 130 246)" },
              JUE: { label: "Jueves", color: "rgb(249 115 22)" },
              VIE: { label: "Viernes", color: "rgb(168 85 247)" },
              SÁ: { label: "Sábado", color: "rgb(236 72 153)" },
              DO: { label: "Domingo", color: "rgb(20 184 166)" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="200%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend className="dark:hover:bg-gray-600" />
                {dayNames.map((day) => (
                  <Bar
                    key={day}
                    dataKey={day}
                    fill={
                      day === "LU"
                        ? "rgb(239 68 68)"
                        : day === "MA"
                        ? "rgb(34 197 94)"
                        : day === "MI"
                        ? "rgb(59 130 246)"
                        : day === "JU"
                        ? "rgb(249 115 22)"
                        : day === "VI"
                        ? "rgb(168 85 247)"
                        : day === "SÁ"
                        ? "rgb(236 72 153)"
                        : "rgb(20 184 166)"
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyTransactionChart;
