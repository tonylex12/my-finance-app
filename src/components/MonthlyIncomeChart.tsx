import { Models } from "appwrite";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
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
import { es } from "date-fns/locale";

const MonthlyIncomeChart = ({
  transactions,
  currentMonth,
}: {
  transactions: Models.DocumentList<Models.Document>;
  currentMonth: Date;
}) => {
  const dailyIncomes = useMemo(() => {
    return transactions.documents
      .filter((transaction) => transaction.type === "Ingreso")
      .reduce((acc: { [key: string]: number }, { date, amount }) => {
        const dateKey = format(parseISO(date), "yyyy-MM-dd");
        acc[dateKey] = (acc[dateKey] || 0) + amount;
        return acc;
      }, {});
  }, [transactions]);

  const weeks = eachWeekOfInterval(
    {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    },
    { weekStartsOn: 1 }
  );

  const chartData = weeks.map((week, weekIndex) => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(week, { weekStartsOn: 1 }),
      end: endOfWeek(week, { weekStartsOn: 1 }),
    });
    const weekData: { [key: string]: number | string } = {
      name: `Semana ${weekIndex + 1}`,
    };

    weekDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayName = format(day, "EEEEEE", { locale: es }).toUpperCase();
      if (isSameMonth(day, currentMonth)) {
        weekData[dayName] = dailyIncomes[dateKey] || 0;
      } else {
        weekData[dayName] = 0;
      }
    });

    return weekData;
  });

  console.log("Chart Data:", chartData);

  const dayNames = ["LU", "MA", "MI", "JU", "VI", "SÁ", "DO"];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="w-auto mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Ventas Diarias por semana
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
                <Legend />
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
export default MonthlyIncomeChart;
