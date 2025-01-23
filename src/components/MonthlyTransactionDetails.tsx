import { Models } from "appwrite";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";
import TransactionsTable from "./TransactionsTable";

const MonthlyTransactionDetails = ({
  transactions,
  currentMonth,
  transactionType,
}: {
  transactions: Models.DocumentList<Models.Document>;
  currentMonth: Date;
  transactionType: "Ingreso" | "Gasto";
}) => {
  const filterTransactions = (
    transactions: Models.DocumentList<Models.Document>,
    month: Date
  ): Models.DocumentList<Models.Document> => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const filteredDocuments = transactions.documents
      .filter(
        (transaction) =>
          transaction.type === transactionType &&
          parseISO(transaction.date) >= start &&
          parseISO(transaction.date) <= end
      )
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

    return {
      total: filteredDocuments.length, // Set total count
      documents: filteredDocuments, // Set filtered documents
    } as Models.DocumentList<Models.Document>;
  };

  const filteredTransactions = filterTransactions(transactions, currentMonth);

  return (
    <>
      <TransactionsTable transactions={filteredTransactions} />
    </>
  );
};

export default MonthlyTransactionDetails;
