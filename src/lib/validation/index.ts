import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(50),
  username: z.string().min(2, { message: "El username debe tener al menos 2 caracteres" }).max(50),
  email: z.string().email({ message: "El correo electronico no es valido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(50),
});
