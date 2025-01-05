import { useGetAllTransactions } from "@/lib/react-query/queriesAndMutations";

const Incomes = () => {
  const { data: transactions, isPending: isTransactionsLoading } =
    useGetAllTransactions();

  const incomes = transactions?.documents
    .filter((transaction) => transaction.type === "Ingreso")
    .map(({ date, amount }) => ({ date, amount }));

  console.log(incomes);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <div className="flex flex-col items-center w-full">
          <p>Ingresos</p>
        </div>
      </div>
    </div>
  );
};
export default Incomes;
