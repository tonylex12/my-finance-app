/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionValidation } from "@/lib/validation";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";
import { useEffect } from "react";

type TransactionFormProps = {
  transaction?: Models.Document;
  action: "Crear" | "Actualizar";
};

const TransactionForm = ({ transaction, action }: TransactionFormProps) => {
  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdatingTransaction } =
    useUpdateTransaction();

  const { user } = useUserContext();

  const { toast } = useToast();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      date: transaction ? new Date(transaction.$createdAt) : new Date(),
      amount: transaction ? transaction.amount : 0,
      type: transaction ? transaction.type : "Ingreso",
      category: transaction ? transaction.category : "Venta",
      notes: transaction ? transaction.notes : "",
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        date: new Date(transaction.$createdAt),
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        notes: transaction.notes,
      });
    }
  }, [transaction, form.reset]);

  async function onSubmit(values: z.infer<typeof TransactionValidation>) {
    if (transaction && action === "Actualizar") {
      const updatedTrasaction = await updateTransaction({
        ...values,
        transactionId: transaction.$id,
      });

      if (!updatedTrasaction) {
        return toast({
          title: "Transacción fallida. Por favor, inténtalo de nuevo",
        });
      }

      navigate("/");
      return;
    }

    const newTrasaction = await createTransaction({
      ...values,
      userId: user.id,
    });

    if (!newTrasaction) {
      return toast({
        title: "Transacción fallida. Por favor, inténtalo de nuevo",
      });
    }

    navigate("/");
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center py-10 px-5 w-full">
        <h2 className="text-[16px] font-bold md:text-[20px] mb-5">
          {action} Transacción
        </h2>
        <div className="flex flex-col items-center w-full mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 lg:w-1/4 sm:w-full"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold mb-2 text-lg">
                      Fecha
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="bg-white text-black">
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-black" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="bg-white text-black"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold mb-2 text-lg">
                      Monto
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="bg-white text-black"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold mb-2 text-lg">
                      Tipo
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white text-black">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="Ingreso">Ingreso</SelectItem>
                        <SelectItem value="Gasto">Gasto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold mb-2 text-lg">
                      Categoría
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white text-black">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="Gasto Fijo">Gasto Fijo</SelectItem>
                        <SelectItem value="Gasto Variable">
                          Gasto Variable
                        </SelectItem>
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Sueldo">Sueldo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold mb-2 text-lg ">
                      Notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Añade notas adicionales aquí"
                        className="bg-white text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-slate-500 text-white hover:bg-slate-600"
                  onClick={() => navigate("/")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-500 text-white w-full hover:bg-blue-700"
                  disabled={isCreatingTransaction || isUpdatingTransaction}
                >
                  {(isCreatingTransaction || isUpdatingTransaction) && (
                    <Loader />
                  )}
                  {action}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default TransactionForm;
