import { Models } from "appwrite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatDate, formatTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogComponent from "./DialogComponent";
import { useDeleteTransaction } from "@/lib/react-query/queriesAndMutations";

const PAGE_SIZE = 10;

const TransactionsTable = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState<
    string | null
  >(null);

  const { mutate: deleteTransaction } = useDeleteTransaction();

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentTransactions = transactions?.documents.slice(
    startIndex,
    endIndex
  );

  const handleDeleteTransaction = () => {
    if (transactionIdToDelete) {
      deleteTransaction(transactionIdToDelete);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <h2 className="text-[16px] font-bold md:text-[20px] py-6">
        Transacciones Recientes
      </h2>
      <Table className="w-auto mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Fecha</TableHead>
            <TableHead className="text-center font-bold">Hora</TableHead>
            <TableHead className="text-center font-bold">Tipo</TableHead>
            <TableHead className="text-center font-bold">Categoría</TableHead>
            <TableHead className="text-center font-bold">Notas</TableHead>
            <TableHead className="text-center font-bold">Monto</TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions?.map((transaction: Models.Document) => (
            <TableRow key={transaction.$id}>
              <TableCell className="font-medium">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="font-medium">
                {formatTime(transaction.date)}
              </TableCell>
              <TableCell className="flex justify-between items-center">
                {transaction.type === "Ingreso" ? (
                  <img
                    src="/assets/icons/upArrow.svg"
                    alt="Ingreso"
                    className="mr-3"
                    width={24}
                    height={24}
                  />
                ) : (
                  <img
                    src="/assets/icons/downArrow.svg"
                    alt="Gasto"
                    className="mr-3"
                    width={24}
                    height={24}
                  />
                )}
                <span>{transaction.type}</span>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  transaction.type === "Ingreso"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                S/.{transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <Link to={`/edit-transaction/${transaction.$id}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="Editar"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={() => {
                    setTransactionIdToDelete(transaction.$id);
                    setDialogOpen(true);
                  }}
                  className="p-1"
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="Eliminar"
                    width={24}
                    height={24}
                    className="md:ml-2"
                  />
                </Button>
                <DialogComponent
                  open={isDialogOpen}
                  onOpenChange={() => setDialogOpen(false)}
                  onConfirm={handleDeleteTransaction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <span className="mx-4">
          Página {currentPage} de{" "}
          {Math.ceil((transactions?.documents.length || 0) / PAGE_SIZE)}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil((transactions?.documents.length || 0) / PAGE_SIZE)
              )
            )
          }
          disabled={
            currentPage ===
            Math.ceil((transactions?.documents.length || 0) / PAGE_SIZE)
          }
          variant="outline"
        >
          Siguiente
        </Button>
      </div>
    </>
  );
};
export default TransactionsTable;
