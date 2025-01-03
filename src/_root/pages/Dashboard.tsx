import { useGetRecentTransactions } from "@/lib/react-query/queriesAndMutations";
import LoaderTwo from "@/components/shared/LoaderTwo";
import TransactionsTable from "@/components/TransactionsTable";
import Summary from "@/components/Summary";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";

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
