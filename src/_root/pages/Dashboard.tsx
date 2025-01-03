/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetRecentTransactions } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import LoaderTwo from "@/components/shared/LoaderTwo";
import TransactionsTable from "@/components/TransactionsTable";
import Summary from "@/components/Summary";

const Dashboard = () => {
  const {
    data: transactions,
    isPending: isTransactionsLoading,
    isError: isErrorTransactions,
  } = useGetRecentTransactions();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <div className="flex flex-col items-center w-full">
          {isTransactionsLoading ? (
            <LoaderTwo />
          ) : transactions ? (
            <>
              <Summary transactions={transactions} />
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
