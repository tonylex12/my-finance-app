export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type INewTransaction = {
  userId: string;
  date: Date;
  amount: number;
  categoryId: string;
  type: "income" | "expense";
};
