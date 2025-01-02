import { INewUser } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createUserAccount,
  getRecentTransactions,
  signInAccount,
  signOutAccount,
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
