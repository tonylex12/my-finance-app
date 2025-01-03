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

const TransactionsTable = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  const handleDeletePost = (id: string) => {
    console.log("delete", id);
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
          {transactions?.documents.map((transaction: Models.Document) => (
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
                    className="mr-3"
                  />
                </Link>
                <Button onClick={() => handleDeletePost(transaction.$id)}>
                  <img
                    src="/assets/icons/delete.svg"
                    alt="Eliminar"
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default TransactionsTable;
