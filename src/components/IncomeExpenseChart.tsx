import { Models } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const IncomeExpenseChart = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  const aggregateMonthlyData = (transactions: Models.Document[]) => {
    const monthlyData = Array(12)
      .fill(null)
      .map((_, index) => ({
        month: new Date(0, index).toLocaleString("es-ES", { month: "short" }), // Get month name
        income: 0,
        expenses: 0,
      }));

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date); // This will correctly parse the ISO date string
      const monthIndex = transactionDate.getUTCMonth(); // Get month index (0-11)

      if (transaction.type === "Ingreso") {
        monthlyData[monthIndex].income += transaction.amount;
      } else {
        monthlyData[monthIndex].expenses += transaction.amount;
      }
    });

    return monthlyData;
  };

  const data = aggregateMonthlyData(transactions?.documents);

  return (
    <div className="lg:w-1/2 py-5">
      <Card className="w-auto mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Ingresos vs Gastos</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 relative overflow-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="income" fill="#22c55e" name="Ingresos" />
              <Bar dataKey="expenses" fill="#ef4444" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
export default IncomeExpenseChart;
