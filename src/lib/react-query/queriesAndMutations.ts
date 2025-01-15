import { INewTransaction, INewUser, IUpdateTransaction } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTransaction,
  createUserAccount,
  deleteTransaction,
  getAllTransactions,
  getCurrentUser,
  getRecentTransactions,
  getTransactionById,
  signInAccount,
  signOutAccount,
  updateTransaction,
} from "../appwrite/api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetRecentTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getRecentTransactions,
  });
};

export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaction: INewTransaction) =>
      createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaction: IUpdateTransaction) =>
      updateTransaction(transaction),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", data?.$id],
      });
    },
  });
};

export const useGetTransactionById = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
};
