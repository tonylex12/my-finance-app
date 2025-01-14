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
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { es } from "date-fns/locale";

type DailyExpense = {
  [date: string]: number;
};

const MonthlyExpenseTable = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dailyExpenses: DailyExpense = useMemo(() => {
    if (!transactions) return {};
    return transactions.documents
      .filter((transaction) => transaction.type === "Gasto")
      .reduce((acc: DailyExpense, { date, amount }) => {
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
    { weekStartsOn: 1 } // Semana comienza el lunes
  );

  const totalExpense = useMemo(() => {
    return Object.entries(dailyExpenses).reduce((sum, [date, amount]) => {
      const expenseDate = parseISO(date);
      if (isSameMonth(expenseDate, currentMonth)) {
        return sum + amount;
      }
      return sum;
    }, 0);
  }, [dailyExpenses, currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  };
  return (
    <>
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Gastos del Mes: {format(currentMonth, "MMMM yyyy", { locale: es })}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Tabla de gastos semanales del mes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] font-bold">Semana</TableHead>
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day) => (
                    <TableHead key={day} className="text-center font-bold">
                      {day}
                    </TableHead>
                  )
                )}
                <TableHead className="text-center font-bold">
                  Total Semanal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeks.map((week, index) => {
                let weeklyTotal = 0;
                const weekDays = eachDayOfInterval({
                  start: startOfWeek(week, { weekStartsOn: 1 }),
                  end: endOfWeek(week, { weekStartsOn: 1 }),
                });

                return (
                  <TableRow key={week.toISOString()}>
                    <TableCell className="font-medium">
                      Semana {index + 1}
                    </TableCell>
                    {weekDays.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const expense = dailyExpenses[dateKey] || 0;
                      weeklyTotal += isSameMonth(day, currentMonth)
                        ? expense
                        : 0;
                      return (
                        <TableCell
                          key={day.toISOString()}
                          className={`text-center font-bold ${
                            !isSameMonth(day, currentMonth)
                              ? "text-gray-400 font-bold"
                              : ""
                          }`}
                        >
                          <div>{format(day, "d")}</div>
                          <div className="text-sm text-red-500 font-bold">
                            {expense ? `$${expense.toFixed(2)}` : "-"}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-semibold text-red-500">
                      ${weeklyTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={9} className="text-right font-bold text-lg">
                  Total del Mes: ${totalExpense.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MonthlyExpenseTable;
