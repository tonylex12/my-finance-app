import { Models } from "appwrite";
import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const calculateDailyTransactions = (transactions: Models.DocumentList<Models.Document>, type: "Ingreso" | "Gasto") => {
  return transactions.documents
    .filter((transaction) => transaction.type === type)
    .reduce((acc: { [key: string]: number }, { date, amount }) => {
      const dateKey = format(parseISO(date), "yyyy-MM-dd");
      acc[dateKey] = (acc[dateKey] || 0) + amount;
      return acc;
    }, {});
};

export const calculateTotal = (dailyTransactions: { [date: string]: number }, currentMonth: Date) => {
  return Object.entries(dailyTransactions).reduce((sum, [date, amount]) => {
    const transactionDate = parseISO(date);
    if (isSameMonth(transactionDate, currentMonth)) {
      return sum + amount;
    }
    return sum;
  }, 0);
};

export const generateChartData = (currentMonth: Date, dailyTransactions: { [date: string]: number }) => {
  const weeks = eachWeekOfInterval(
    {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    },
    { weekStartsOn: 1 }
  );

  return weeks.map((week, weekIndex) => {
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
      weekData[dayName] = dailyTransactions[dateKey] || 0;
    });

    return weekData;
  });
};
