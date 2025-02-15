"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const { toast } = useToast();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  async function onSubmit(user: z.infer<typeof SignUpValidation>) {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        return toast({
          title: "Sign Up Failed. Please try again",
        });
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({
          title: "Login in failed. Please try again",
        });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center">
        <p className="font-bold text-3xl">Finance App</p>
        <h2 className="text-2xl font-bold pt-5">Crear una cuenta</h2>
        <p className="text-[16px] font-medium mt-5">
          Ingrese sus datos para crear una cuenta
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input text-black" {...field} />
                </FormControl>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input text-black" {...field} />
                </FormControl>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input text-black" {...field} />
                </FormControl>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input text-black" {...field} />
                </FormControl>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary-500 hover:bg-primary-500 text-white flex gap-2 mt-4 mx-2"
          >
            {isCreatingAccount || isSigningIn || isUserLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                Cargando
              </div>
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <p className="text-center mt-4 text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/sign-in"
              className="text-primary-500 hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SignUpForm;
