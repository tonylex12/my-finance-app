import { useGetRecentTransactions } from "@/lib/react-query/queriesAndMutations";
import LoaderTwo from "@/components/shared/LoaderTwo";
import TransactionsTable from "@/components/TransactionsTable";
import Summary from "@/components/Summary";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import TransactionDataTable from "@/components/TransactionsDataTable";

const Dashboard = () => {
  const { data: transactions, isPending: isTransactionsLoading } =
    useGetRecentTransactions();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <div className="flex flex-col items-center w-full">
          {isTransactionsLoading ? (
            <LoaderTwo />
          ) : transactions ? (
            <>
              <Summary transactions={transactions} />
              <IncomeExpenseChart transactions={transactions} />
              <TransactionsTable transactions={transactions} />
              {/* <Card className="w-full max-w-5xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Tabla de Transacciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions && transactions.documents && (
                    <TransactionDataTable transactions={transactions} />
                  )}
                </CardContent>
              </Card> */}
            </>
          ) : (
            <p>No hay transacciones recientes</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
