import { useGetAllTransactions } from "@/lib/react-query/queriesAndMutations";
import LoaderTwo from "@/components/shared/LoaderTwo";
import MonthlyTransactionTable from "@/components/MonthlyTransactionTable";

const Incomes = () => {
  const { data: transactions, isPending: isTransactionsLoading } =
    useGetAllTransactions();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full mt-10">
        <div className="flex flex-col items-center w-full">
          {isTransactionsLoading ? (
            <LoaderTwo />
          ) : transactions ? (
            <>
              <h2 className="text-[16px] font-bold md:text-[20px] mb-10">
                Resumen de Ingresos
              </h2>
              <MonthlyTransactionTable
                transactions={transactions}
                transactionType="Ingreso"
              />
            </>
          ) : (
            <p>No hay transacciones recientes</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Incomes;
