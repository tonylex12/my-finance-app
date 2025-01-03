import { Models } from "appwrite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const TransactionsTable = ({
  transactions,
}: {
  transactions: Models.DocumentList<Models.Document>;
}) => {
  return (
    <>
      <h2 className="text-[16px] font-bold md:text-[20px] py-6">
        Transacciones Recientes
      </h2>
      <Table className="w-auto mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Fecha</TableHead>
            <TableHead className="font-bold">Hora</TableHead>
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold">Categoría</TableHead>
            <TableHead className="font-bold">Notas</TableHead>
            <TableHead className="text-right font-bold">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.documents.map((transaction: Models.Document) => (
            <TableRow key={transaction.$id}>
              <TableCell className="font-medium">
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {new Date(transaction.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "utc",
                })}
              </TableCell>
              <TableCell className="flex justify-between items-center">
                {transaction.type === "income" ? (
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
                <span>
                  {transaction.type === "income" ? "Ingreso" : "Gasto"}
                </span>
              </TableCell>
              <TableCell>{transaction.category.name}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                S/.{transaction.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default TransactionsTable;
