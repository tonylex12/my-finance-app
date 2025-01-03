import { Models } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Summary = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  const totalIncome = transactions?.documents.reduce((acc, transaction) => {
    if (transaction.type === "income") {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);

  const totalExpense = transactions?.documents.reduce((acc, transaction) => {
    if (transaction.type === "expense") {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);

  const balance = totalIncome - totalExpense;

  return (
    <>
      <h2 className="text-[16px] font-bold md:text-[20px] mb-5">
        Resumen de Transacciones
      </h2>
      <div className="grid gap-4 md:grid-cols-3 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm text-center font-bold">
              Total de Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 text-center">
              S/.{totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm text-center font-bold">
              Total de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 text-center">
              S/.{totalExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm text-center font-bold">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              S/.{balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default Summary;
