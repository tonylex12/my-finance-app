import TransactionForm from "@/components/forms/TransactionForm";

const NewTransaction = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <TransactionForm action="Crear" />
      </div>
    </div>
  );
};
export default NewTransaction;
