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
import { SignInValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isLoading } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(user: z.infer<typeof SignInValidation>) {
    const session = await signInAccount(user);

    if (!session) {
      toast({
        title: "Inicio de sesión fallido. Por favor, inténtalo de nuevo",
      });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      toast({
        title: "Inicio de sesión fallido. Por favor, inténtalo de nuevo.",
      });

      return;
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center">
        <p className="font-bold text-3xl">Finance App</p>
        <h2 className="text-2xl font-bold pt-5">Iniciar sesión</h2>
        <p className="text-[16px] font-medium mt-5">
          Ingrese sus datos para iniciar sesión
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary-500 hover:bg-primary-500 text-white flex gap-2 mt-4 mx-2"
          >
            {isUserLoading || isLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                Cargando
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </Button>

          <p className="text-center mt-4 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 hover:underline font-medium"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SignInForm;
