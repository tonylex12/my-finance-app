import TransactionForm from "@/components/forms/TransactionForm";
import LoaderTwo from "@/components/shared/LoaderTwo";
import { useGetTransactionById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditTransaction = () => {
  const { id } = useParams();
  const { data: transaction, isPending } = useGetTransactionById(id || "");

  if(isPending) return <LoaderTwo />
  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <TransactionForm action="Actualizar" transaction={transaction} />
      </div>
    </div>
  )
}
export default EditTransaction
