import { INewTransaction, INewUser, IUpdateTransaction } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    console.log(avatarUrl);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL | string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    // Create new session
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getRecentTransactions() {
  const recentTransactions = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.transactionCollectionId,
    [Query.orderDesc("date"), Query.limit(20)]
  );

  if (!recentTransactions) throw Error;

  return recentTransactions;
}

export async function getAllTransactions() {
  const allTransactions = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.transactionCollectionId
  );

  if (!allTransactions) throw Error;

  return allTransactions;
}

export async function createTransaction(transaction: INewTransaction) {
  try {
    const newTransaction = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      ID.unique(),
      {
        user: transaction.userId,
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        notes: transaction.notes,
      }
    );

    if (!newTransaction) throw Error;

    return newTransaction;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTransaction(transaction: IUpdateTransaction) {
  try {
    const updatedTransaction = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      transaction.transactionId,
      {
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        notes: transaction.notes,
      }
    );

    if (!updatedTransaction) throw Error;

    return updatedTransaction;
  } catch (error) {
    console.log(error);
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const transaction = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      transactionId
    );

    if (!transaction) throw Error;

    return transaction;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTransaction(transactionId: string) {
  if (!transactionId) throw Error;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      transactionId
    );

    if (!statusCode) throw Error;

    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}
